"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { firestoreService } from "@/firebase";
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

interface Conversation {
  unreadCount: number;
}

export default function UnreadMessagesCounter() {
  const { user, userData } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.uid || !userData?.role) return;

    // Construire le chemin de la collection en fonction du type d'utilisateur
    const collectionPath = `${userData.role}s/${user.uid}/conversations`;

    // Écouter les changements dans les conversations
    const unsubscribe = onSnapshot(
      firestoreService.getQueryBuilder(
        collectionPath
      ) as CollectionReference<DocumentData>,
      (snapshot: QuerySnapshot<DocumentData>) => {
        let totalUnread = 0;
        snapshot.forEach((doc) => {
          const conversation = doc.data() as Conversation;
          totalUnread += conversation.unreadCount || 0;
        });
        setUnreadCount(totalUnread);
      },
      (error: Error) => {
        console.error("Erreur lors de l'écoute des messages non lus:", error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, userData?.role]);

  if (unreadCount === 0) return null;

  return (
    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
      {unreadCount}
    </span>
  );
}
