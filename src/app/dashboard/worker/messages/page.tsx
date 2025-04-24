"use client";

import MessagingSystem, {
  Conversation,
} from "@/app/components/MessagingSystem";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

interface FirestoreMessage extends FirestoreDocument {
  senderName: string;
  senderAvatar?: string;
  isFromWorker: boolean;
  content: string;
  timestamp: string;
  isRead: boolean;
  createdAt: Date;
  files?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
}

interface FirestoreConversation extends FirestoreDocument {
  workerId: string;
  adminId?: string;
  contact: {
    name: string;
    title: string;
    avatar?: string;
    isAdmin?: boolean;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isFromUser: boolean;
  };
  unreadCount: number;
  updatedAt: Date;
  messages: FirestoreMessage[];
}

interface WorkerMessagesDocument extends FirestoreDocument {
  conversations: FirestoreConversation[];
}

export default function WorkerMessagesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  // Références pour suivre l'état du chargement
  const isDataFetchingRef = useRef(false);
  const isDataLoadedRef = useRef(false);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user?.uid || isDataFetchingRef.current || isDataLoadedRef.current) {
        return;
      }

      isDataFetchingRef.current = true;
      setIsLoading(true);

      try {
        const workerMessages =
          await firestoreService.getDocument<WorkerMessagesDocument>(
            "workers",
            user.uid
          );

        if (workerMessages?.conversations) {
          // Convertir les conversations Firestore en format attendu par MessagingSystem
          const formattedConversations = workerMessages.conversations.map(
            (conv) => ({
              id: parseInt(conv.id || "0"),
              type: "individual" as const,
              participants: [
                { id: conv.workerId, type: "worker" as const, name: "Vous" },
                {
                  id: conv.adminId || "admin",
                  type: "admin" as const,
                  name: conv.contact.name,
                },
              ],
              contact: conv.contact,
              lastMessage: conv.lastMessage,
              unreadCount: conv.unreadCount,
              messages: conv.messages.map((msg: FirestoreMessage) => ({
                id: parseInt(msg.id || "0"),
                sender: {
                  name:
                    msg.senderName ||
                    (msg.isFromWorker ? "Vous" : conv.contact.name),
                  avatar: msg.senderAvatar,
                  isAdmin: !msg.isFromWorker,
                },
                content: msg.content,
                timestamp: msg.timestamp,
                isRead: msg.isRead,
                files: msg.files,
              })),
            })
          );

          setConversations(formattedConversations);
          isDataLoadedRef.current = true;
        } else {
          // Si aucun message n'existe, initialiser avec une structure vide
          await firestoreService.updateDocument<WorkerMessagesDocument>(
            "workers",
            user.uid,
            {
              conversations: [],
            }
          );
          setConversations([]);
          isDataLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Erreur lors du chargement des messages");
      } finally {
        setIsLoading(false);
        isDataFetchingRef.current = false;
      }
    };

    loadMessages();
  }, [user?.uid, toast]);

  // Écouter les changements dans les messages de la conversation active
  useEffect(() => {
    if (!user?.uid || !activeConversation?.id) return;

    // Référence à la collection de messages
    const messagesQuery = firestoreService.getQueryBuilder(
      `workers/${user.uid}/conversations/${activeConversation.id}/messages`
    );

    // Configuration du listener
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newMessage = change.doc.data() as FirestoreMessage;

          // Vérifier si le message n'existe pas déjà dans la conversation
          setActiveConversation((prev) => {
            if (!prev) return null;

            const messageExists = prev.messages.some(
              (msg) => msg.id === change.doc.id
            );

            if (!messageExists) {
              return {
                ...prev,
                messages: [
                  ...prev.messages,
                  {
                    id: change.doc.id,
                    sender: {
                      name:
                        newMessage.senderName ||
                        (newMessage.isFromWorker ? "Vous" : prev.contact.name),
                      avatar: newMessage.senderAvatar,
                      isAdmin: !newMessage.isFromWorker,
                    },
                    content: newMessage.content,
                    timestamp: newMessage.timestamp,
                    isRead: newMessage.isRead,
                    files: newMessage.files,
                  },
                ],
              };
            }

            return prev;
          });

          // Mettre à jour la liste des conversations
          setConversations((prevConvs) =>
            prevConvs.map((conv) => {
              if (conv.id === activeConversation.id) {
                return {
                  ...conv,
                  lastMessage: {
                    content: newMessage.content,
                    timestamp: newMessage.timestamp,
                    isFromUser: newMessage.isFromWorker,
                  },
                };
              }
              return conv;
            })
          );
        }
      });
    });

    // Nettoyage du listener lors du démontage du composant
    return () => unsubscribe();
  }, [user?.uid, activeConversation?.id]);

  // Écouter les changements dans les conversations
  useEffect(() => {
    if (!user?.uid) return;

    const conversationsQuery = firestoreService.getQueryBuilder(
      `workers/${user.uid}/conversations`
    );

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const conversationData = change.doc.data() as FirestoreConversation;

        if (change.type === "added" || change.type === "modified") {
          setConversations((prevConvs) => {
            const existingIndex = prevConvs.findIndex(
              (conv) => conv.id === change.doc.id
            );

            const updatedConversation: Conversation = {
              id: parseInt(change.doc.id),
              type: "individual" as const,
              participants: [
                {
                  id: conversationData.workerId,
                  type: "worker" as const,
                  name: "Vous",
                },
                {
                  id: conversationData.adminId || "admin",
                  type: "admin" as const,
                  name: conversationData.contact.name,
                },
              ],
              contact: conversationData.contact,
              lastMessage: conversationData.lastMessage,
              unreadCount: conversationData.unreadCount,
              messages:
                conversationData.messages?.map((msg: FirestoreMessage) => ({
                  id: parseInt(msg.id || "0"),
                  sender: {
                    name:
                      msg.senderName ||
                      (msg.isFromWorker
                        ? "Vous"
                        : conversationData.contact.name),
                    avatar: msg.senderAvatar,
                    isAdmin: !msg.isFromWorker,
                  },
                  content: msg.content,
                  timestamp: msg.timestamp,
                  isRead: msg.isRead,
                  files: msg.files,
                })) || [],
            };

            if (existingIndex > -1) {
              // Mettre à jour la conversation existante
              const newConversations = [...prevConvs];
              newConversations[existingIndex] = updatedConversation;
              return newConversations;
            } else {
              // Ajouter la nouvelle conversation
              return [...prevConvs, updatedConversation];
            }
          });
        }

        if (change.type === "removed") {
          setConversations((prevConvs) =>
            prevConvs.filter((conv) => conv.id !== change.doc.id)
          );
        }
      });
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Fonction pour envoyer un message
  const handleSendMessage = async (
    conversationId: string | number,
    content: string
  ) => {
    if (!user?.uid) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }

    try {
      const timestamp = new Date();
      const messageId = `MSG${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Message pour la conversation worker
      const workerMessage: FirestoreMessage = {
        id: messageId,
        senderName: "Vous",
        isFromWorker: true,
        content: content,
        timestamp: timestamp.toISOString(),
        isRead: true,
        createdAt: timestamp,
      };

      // Mettre à jour la conversation dans Firestore
      await firestoreService.addDocument(
        `workers/${user.uid}/conversations/${conversationId}/messages`,
        workerMessage
      );

      // Mettre à jour les métadonnées de la conversation
      await firestoreService.updateDocument(
        `workers/${user.uid}/conversations`,
        conversationId.toString(),
        {
          lastMessage: {
            content: content,
            timestamp: timestamp.toISOString(),
            isFromUser: true,
          },
          updatedAt: timestamp,
        }
      );

      // Mettre à jour l'état local
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: messageId,
                  sender: {
                    name: "Vous",
                    isAdmin: false,
                  },
                  content: content,
                  timestamp: "À l'instant",
                  isRead: true,
                },
              ],
              lastMessage: {
                content: content,
                timestamp: "À l'instant",
                isFromUser: true,
              },
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <MessagingSystem
      initialConversations={conversations}
      title="Messages Professionnel"
      onSendMessage={handleSendMessage}
    />
  );
}
