"use client";

import MessagingSystem from "@/app/components/MessagingSystem";

export default function MessagesPage() {
  // Données fictives pour les conversations d'étudiants
  const studentConversations = [
    {
      id: 1,
      contact: {
        name: "Emma Dupont",
        title: "Responsable admissions",
        avatar: "/avatar-1.jpg",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Veuillez compléter votre dossier de candidature avant la date limite du 15 mai.",
        timestamp: "14:30",
        isFromUser: false,
      },
      unreadCount: 1,
      messages: [
        {
          id: 1,
          sender: {
            name: "Emma Dupont",
            avatar: "/avatar-1.jpg",
            isAdmin: true,
          },
          content:
            "Bonjour, nous avons bien reçu votre candidature pour le programme d&apos;échange à l&apos;Université de Toronto.",
          timestamp: "Hier, 10:15",
          isRead: true,
        },
        {
          id: 2,
          sender: {
            name: "Vous",
          },
          content:
            "Bonjour, merci pour votre retour. Quelles sont les prochaines étapes ?",
          timestamp: "Hier, 11:30",
          isRead: true,
        },
        {
          id: 3,
          sender: {
            name: "Emma Dupont",
            avatar: "/avatar-1.jpg",
            isAdmin: true,
          },
          content:
            "Veuillez compléter votre dossier de candidature avant la date limite du 15 mai. Il manque encore quelques documents importants.",
          timestamp: "Aujourd&apos;hui, 14:30",
          isRead: false,
          files: [
            {
              name: "Liste_documents_requis.pdf",
              size: "245 KB",
              type: "pdf",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      contact: {
        name: "Support technique",
        title: "Service technique",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Votre demande a bien été prise en compte, nous reviendrons vers vous rapidement.",
        timestamp: "Hier",
        isFromUser: false,
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: {
            name: "Vous",
          },
          content:
            "Bonjour, je rencontre des difficultés pour téléverser mon relevé de notes. Le système affiche une erreur.",
          timestamp: "Hier, 09:15",
          isRead: true,
        },
        {
          id: 2,
          sender: {
            name: "Support technique",
            isAdmin: true,
          },
          content:
            "Votre demande a bien été prise en compte, nous reviendrons vers vous rapidement. Quel type d&apos;erreur rencontrez-vous exactement ?",
          timestamp: "Hier, 09:30",
          isRead: true,
        },
      ],
    },
  ];

  return (
    <MessagingSystem
      initialConversations={studentConversations}
      title="Messages Étudiant"
    />
  );
}
