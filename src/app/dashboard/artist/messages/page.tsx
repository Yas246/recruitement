"use client";

import MessagingSystem from "@/app/components/MessagingSystem";

export default function ArtistMessagesPage() {
  // Données fictives pour les conversations des artistes
  const artistConversations = [
    {
      id: 1,
      contact: {
        name: "Directeur artistique OMSHINA",
        title: "Direction artistique",
        avatar: "/avatar-4.jpg",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Votre portfolio est impressionnant. Nous aimerions discuter de votre participation à une exposition collective à Paris.",
        timestamp: "15:45",
        isFromUser: false,
      },
      unreadCount: 1,
      messages: [
        {
          id: 1,
          sender: {
            name: "Directeur artistique OMSHINA",
            avatar: "/avatar-4.jpg",
            isAdmin: true,
          },
          content:
            "Bonjour, nous avons examiné votre portfolio et nous sommes impressionnés par votre travail sur les installations interactives.",
          timestamp: "Hier, 10:30",
          isRead: true,
        },
        {
          id: 2,
          sender: {
            name: "Vous",
          },
          content:
            "Merci beaucoup pour votre retour. Ces installations représentent une partie importante de mon travail récent.",
          timestamp: "Hier, 11:15",
          isRead: true,
        },
        {
          id: 3,
          sender: {
            name: "Directeur artistique OMSHINA",
            avatar: "/avatar-4.jpg",
            isAdmin: true,
          },
          content:
            "Votre portfolio est impressionnant. Nous aimerions discuter de votre participation à une exposition collective à Paris.",
          timestamp: "Aujourd'hui, 15:45",
          isRead: false,
          files: [
            {
              name: "Invitation_exposition.pdf",
              size: "320 KB",
              type: "pdf",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      contact: {
        name: "Service des opportunités internationales",
        title: "Opportunités internationales",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Nous vous invitons à participer au Festival International des Arts de Berlin en septembre.",
        timestamp: "Hier",
        isFromUser: false,
      },
      unreadCount: 1,
      messages: [
        {
          id: 1,
          sender: {
            name: "Service des opportunités internationales",
            isAdmin: true,
          },
          content:
            "Bonjour, nous vous invitons à participer au Festival International des Arts de Berlin en septembre. Votre travail a été recommandé par notre comité de sélection.",
          timestamp: "Hier, 11:20",
          isRead: false,
        },
      ],
    },
    {
      id: 3,
      contact: {
        name: "Clara Dumont",
        title: "Galeriste",
        avatar: "/avatar-5.jpg",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Vos œuvres récentes ont attiré mon attention. Seriez-vous disponible pour discuter d'une représentation potentielle?",
        timestamp: "Lundi",
        isFromUser: false,
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: {
            name: "Clara Dumont",
            avatar: "/avatar-5.jpg",
            isAdmin: true,
          },
          content:
            "Vos œuvres récentes ont attiré mon attention. Seriez-vous disponible pour discuter d'une représentation potentielle? Je pense que votre style serait parfait pour notre galerie.",
          timestamp: "Lundi, 16:40",
          isRead: true,
        },
        {
          id: 2,
          sender: {
            name: "Vous",
          },
          content:
            "Bonjour Clara, je serais ravi d'en discuter. Je suis disponible en fin de semaine pour un appel ou une rencontre.",
          timestamp: "Lundi, 17:15",
          isRead: true,
        },
      ],
    },
    {
      id: 4,
      contact: {
        name: "Programme de résidence artistique",
        title: "Berlin Cultural Institute",
        isAdmin: true,
      },
      lastMessage: {
        content: "Voici les conditions pour la résidence artistique à Berlin.",
        timestamp: "Vendredi",
        isFromUser: false,
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: {
            name: "Programme de résidence artistique",
            isAdmin: true,
          },
          content:
            "Voici les conditions pour la résidence artistique à Berlin. Nous offrons un studio privé, une bourse mensuelle et une exposition finale.",
          timestamp: "Vendredi, 09:20",
          isRead: true,
          files: [
            {
              name: "Conditions_residence_Berlin.pdf",
              size: "425 KB",
              type: "pdf",
            },
          ],
        },
        {
          id: 2,
          sender: {
            name: "Vous",
          },
          content:
            "Merci pour ces informations. Ce programme semble très intéressant et correspondrait parfaitement à mon projet actuel sur les espaces urbains.",
          timestamp: "Vendredi, 10:05",
          isRead: true,
        },
      ],
    },
  ];

  return (
    <MessagingSystem
      initialConversations={artistConversations}
      title="Messages Artistique"
    />
  );
}
