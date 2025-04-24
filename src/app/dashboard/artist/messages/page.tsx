"use client";

import MessagingSystem, {
  Conversation,
} from "@/app/components/MessagingSystem";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { useEffect, useRef, useState } from "react";

interface FirestoreMessage extends FirestoreDocument {
  senderName: string;
  senderAvatar?: string;
  isFromArtist: boolean;
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
  artistId: string;
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

interface ArtistMessagesDocument extends FirestoreDocument {
  conversations: FirestoreConversation[];
}

export default function ArtistMessagesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

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
        const artistMessages =
          await firestoreService.getDocument<ArtistMessagesDocument>(
            "artists",
            user.uid
          );

        if (artistMessages?.conversations) {
          // Convertir les conversations Firestore en format attendu par MessagingSystem
          const formattedConversations = artistMessages.conversations.map(
            (conv) => ({
              id: parseInt(conv.id || "0"),
              type: "individual" as const,
              participants: [
                {
                  id: user.uid,
                  type: "artist" as const,
                  name: user.displayName || "Artist",
                },
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
                    (msg.isFromArtist ? "Vous" : conv.contact.name),
                  avatar: msg.senderAvatar,
                  isAdmin: !msg.isFromArtist,
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
          await firestoreService.updateDocument<ArtistMessagesDocument>(
            "artists",
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
  }, [user?.uid, toast, user?.displayName]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <MessagingSystem initialConversations={conversations} title="Messages" />
  );
}
