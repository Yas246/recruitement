"use client";

import MessagingSystem from "@/app/components/MessagingSystem";

export default function WorkerMessagesPage() {
  // Données fictives pour les conversations des travailleurs
  const workerConversations = [
    {
      id: 1,
      contact: {
        name: "Sophie Martin",
        title: "Responsable recrutement",
        avatar: "/avatar-2.jpg",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Votre candidature a été retenue, nous aimerions vous proposer un entretien en visioconférence.",
        timestamp: "10:15",
        isFromUser: false,
      },
      unreadCount: 2,
      messages: [
        {
          id: 1,
          sender: {
            name: "Sophie Martin",
            avatar: "/avatar-2.jpg",
            isAdmin: true,
          },
          content:
            "Bonjour, nous avons bien reçu votre candidature pour le poste de développeur senior.",
          timestamp: "Hier, 14:30",
          isRead: true,
        },
        {
          id: 2,
          sender: {
            name: "Vous",
          },
          content:
            "Bonjour, merci pour votre retour. Je suis très intéressé par cette opportunité.",
          timestamp: "Hier, 15:45",
          isRead: true,
        },
        {
          id: 3,
          sender: {
            name: "Sophie Martin",
            avatar: "/avatar-2.jpg",
            isAdmin: true,
          },
          content:
            "Votre candidature a été retenue, nous aimerions vous proposer un entretien en visioconférence.",
          timestamp: "Aujourd'hui, 10:15",
          isRead: false,
        },
        {
          id: 4,
          sender: {
            name: "Sophie Martin",
            avatar: "/avatar-2.jpg",
            isAdmin: true,
          },
          content:
            "Pourriez-vous nous indiquer vos disponibilités pour la semaine prochaine?",
          timestamp: "Aujourd'hui, 10:17",
          isRead: false,
          files: [
            {
              name: "Infos_entretien.pdf",
              size: "185 KB",
              type: "pdf",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      contact: {
        name: "Service administratif",
        title: "Administration",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Nous avons besoin des documents manquants pour finaliser votre dossier.",
        timestamp: "Hier",
        isFromUser: false,
      },
      unreadCount: 1,
      messages: [
        {
          id: 1,
          sender: {
            name: "Service administratif",
            isAdmin: true,
          },
          content:
            "Bonjour, nous avons besoin des documents manquants pour finaliser votre dossier.",
          timestamp: "Hier, 11:20",
          isRead: false,
        },
      ],
    },
    {
      id: 3,
      contact: {
        name: "Thomas Dubois",
        title: "Chef de projet",
        avatar: "/avatar-3.jpg",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Merci pour votre participation à la réunion d'équipe de ce matin.",
        timestamp: "Lundi",
        isFromUser: false,
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: {
            name: "Thomas Dubois",
            avatar: "/avatar-3.jpg",
            isAdmin: true,
          },
          content:
            "Merci pour votre participation à la réunion d'équipe de ce matin. Voici le planning actualisé du projet.",
          timestamp: "Lundi, 14:00",
          isRead: true,
          files: [
            {
              name: "Planning_projet_Q2.xlsx",
              size: "320 KB",
              type: "xlsx",
            },
          ],
        },
        {
          id: 2,
          sender: {
            name: "Vous",
          },
          content:
            "Merci pour ces informations. J'ai déjà commencé à travailler sur les tâches qui m'ont été assignées.",
          timestamp: "Lundi, 15:30",
          isRead: true,
        },
      ],
    },
  ];

  return (
    <MessagingSystem
      initialConversations={workerConversations}
      title="Messages Professionnel"
    />
  );
}
