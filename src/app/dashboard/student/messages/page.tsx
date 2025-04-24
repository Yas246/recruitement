"use client";

import MessagingSystem, {
  Conversation,
  Message,
  MessageFile,
} from "@/app/components/MessagingSystem";
import { useAuth } from "@/app/contexts/AuthContext";
import { formatTimestamp } from "@/app/utils/formatTimestamp";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { orderBy, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface MessageSender {
  name: string;
  avatar?: string;
  isAdmin: boolean;
}

interface Contact extends Record<string, unknown> {
  id: string;
  type: string;
  name: string;
  title: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface FirestoreMessage extends FirestoreDocument {
  id?: string;
  conversationId?: string;
  senderName?: string;
  senderAvatar?: string;
  isFromStudent?: boolean;
  content: string;
  timestamp: Timestamp | string;
  isRead?: boolean;
  files?: MessageFile[];
  createdAt?: Date;
}

interface FirestoreConversation extends FirestoreDocument {
  id?: string;
  type?: "individual" | "group";
  participants?: Array<{
    id: string;
    type: "admin" | "student" | "worker" | "artist";
    name: string;
  }>;
  contact: Contact;
  lastMessage?: {
    content: string;
    timestamp: Timestamp | string;
    isFromUser: boolean;
  };
  unreadCount?: number;
  userId?: string;
  userType?: "student" | "worker" | "artist";
  userName?: string;
  userEmail?: string;
  status?: "active" | "resolved" | "pending";
  updatedAt: Timestamp | Date;
}

export default function MessagesPage() {
  const { userData } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userData?.id) return;

      try {
        setLoading(true);
        // Récupérer les conversations de l'étudiant depuis le bon chemin
        const conversationsResult =
          await firestoreService.queryDocuments<FirestoreConversation>(
            `students/${userData.id}/conversations`,
            [orderBy("updatedAt", "desc")]
          );

        if (conversationsResult && Array.isArray(conversationsResult)) {
          // Pour chaque conversation, récupérer les messages associés
          const conversationsWithMessages = await Promise.all(
            (conversationsResult as FirestoreConversation[]).map(
              async (conv: FirestoreConversation) => {
                if (!conv.id) return null;

                // Récupérer les messages de cette conversation
                const messagesResult =
                  await firestoreService.queryDocuments<FirestoreMessage>(
                    `students/${userData.id}/conversations/${conv.id}/messages`,
                    [orderBy("createdAt", "asc")]
                  );

                // Convertir les messages Firestore en format attendu par MessagingSystem
                const formattedMessages: Message[] = (
                  messagesResult as FirestoreMessage[]
                ).map((msg: FirestoreMessage) => {
                  const sender: MessageSender = {
                    name:
                      msg.senderName ||
                      (msg.isFromStudent ? "Vous" : conv.contact.name),
                    avatar: msg.senderAvatar,
                    isAdmin: !msg.isFromStudent,
                  };

                  return {
                    id: parseInt(msg.id || "0"),
                    sender,
                    content: msg.content,
                    timestamp:
                      typeof msg.timestamp === "string"
                        ? msg.timestamp
                        : formatTimestamp(msg.timestamp),
                    isRead: msg.isRead || false,
                    files: msg.files || [],
                  };
                });

                // Créer la conversation au format attendu par MessagingSystem
                const conversation: Conversation = {
                  id: parseInt(conv.id),
                  type: conv.type || "individual",
                  participants: conv.participants || [
                    {
                      id: conv.userId || "",
                      type: conv.userType || "student",
                      name: conv.userName || "",
                    },
                  ],
                  contact: conv.contact,
                  lastMessage: conv.lastMessage
                    ? {
                        content: conv.lastMessage.content,
                        timestamp:
                          typeof conv.lastMessage.timestamp === "string"
                            ? conv.lastMessage.timestamp
                            : formatTimestamp(conv.lastMessage.timestamp),
                        isFromUser: conv.lastMessage.isFromUser,
                      }
                    : {
                        content: "",
                        timestamp: formatTimestamp(Timestamp.now()),
                        isFromUser: false,
                      },
                  unreadCount: conv.unreadCount || 0,
                  messages: formattedMessages,
                  userId: conv.userId || "",
                  userType: conv.userType || "student",
                  userName: conv.userName || "",
                  userEmail: conv.userEmail || "",
                  status: conv.status || "active",
                  updatedAt:
                    conv.updatedAt instanceof Timestamp
                      ? conv.updatedAt.toDate()
                      : conv.updatedAt,
                };

                return conversation;
              }
            )
          ).then((results) =>
            results.filter((conv): conv is Conversation => conv !== null)
          );

          setConversations(conversationsWithMessages);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des conversations:",
          error
        );
        toast.error("Impossible de récupérer vos messages");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userData?.id]);

  // Fonction pour envoyer un message
  const handleSendMessage = async (
    conversationId: string | number,
    content: string
  ) => {
    if (!userData?.id) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }

    try {
      const conversation = conversations.find(
        (conv) => conv.id.toString() === conversationId.toString()
      );
      if (!conversation) {
        toast.error("Conversation non trouvée");
        return;
      }

      const timestamp = new Date();
      const messageId = `MSG${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Message pour la conversation étudiant
      const studentMessage: FirestoreMessage = {
        id: messageId,
        conversationId: conversationId.toString(),
        senderName: "Vous",
        isFromStudent: true,
        content: content,
        timestamp: timestamp.toISOString(),
        isRead: true,
        createdAt: timestamp,
      };

      // Mettre à jour la conversation admin
      const adminConversationRef =
        await firestoreService.queryDocuments<FirestoreConversation>(
          "conversations",
          [where("userId", "==", userData.id)]
        );

      if (adminConversationRef && adminConversationRef.length > 0) {
        const adminConversation = adminConversationRef[0];
        if (!adminConversation.id) return;

        // Créer le message admin dans la collection de messages
        const adminMessageData: FirestoreMessage = {
          id: messageId,
          conversationId: adminConversation.id,
          senderName: "Vous",
          isFromStudent: true,
          content: content,
          timestamp: timestamp.toISOString(),
          isRead: true,
          createdAt: timestamp,
        };

        // Mettre à jour les deux conversations
        await Promise.all([
          // Ajouter le message dans la conversation étudiant
          firestoreService.addDocument(
            `students/${userData.id}/conversations/${conversationId}/messages`,
            studentMessage
          ),
          // Ajouter le message dans la conversation admin
          firestoreService.addDocument(
            `conversations/${adminConversation.id}/messages`,
            adminMessageData
          ),
          // Mettre à jour le dernier message de la conversation admin
          firestoreService.updateDocument(
            "conversations",
            adminConversation.id,
            {
              lastMessage: {
                content: content,
                timestamp: timestamp.toISOString(),
                isFromUser: true,
              },
              updatedAt: timestamp,
            }
          ),
        ]);

        // Mettre à jour l'état local
        const updatedConversations = conversations.map((conv) => {
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
        });
        setConversations(updatedConversations);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <MessagingSystem
      initialConversations={conversations}
      title="Messages Étudiant"
      onSendMessage={handleSendMessage}
    />
  );
}
