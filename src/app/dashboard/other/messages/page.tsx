"use client";

import MessagingSystem from "@/app/components/MessagingSystem";

export default function OtherMessagesPage() {
  // Données fictives pour les conversations des utilisateurs "other"
  const otherConversations = [
    {
      id: 1,
      contact: {
        name: "Conseiller OMSHINA",
        title: "Service orientation",
        avatar: "/avatar-6.jpg",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Nous avons bien reçu votre projet. Pouvez-vous préciser quelles sont vos principales attentes concernant notre accompagnement?",
        timestamp: "11:20",
        isFromUser: false,
      },
      unreadCount: 1,
      messages: [
        {
          id: 1,
          sender: {
            name: "Conseiller OMSHINA",
            avatar: "/avatar-6.jpg",
            isAdmin: true,
          },
          content:
            "Bonjour, merci pour votre inscription sur notre plateforme. Nous sommes ravis de pouvoir vous accompagner dans votre projet international.",
          timestamp: "Hier, 14:30",
          isRead: true,
        },
        {
          id: 2,
          sender: {
            name: "Vous",
          },
          content:
            "Bonjour, merci pour votre accueil. Je souhaite établir un projet d'expatriation au Canada dans le domaine du développement durable.",
          timestamp: "Hier, 15:45",
          isRead: true,
        },
        {
          id: 3,
          sender: {
            name: "Conseiller OMSHINA",
            avatar: "/avatar-6.jpg",
            isAdmin: true,
          },
          content:
            "Nous avons bien reçu votre projet. Pouvez-vous préciser quelles sont vos principales attentes concernant notre accompagnement?",
          timestamp: "Aujourd'hui, 11:20",
          isRead: false,
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
          "Veuillez téléverser les documents manquants dans votre espace documents.",
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
            "Bonjour, nous avons remarqué qu'il manque certains documents obligatoires dans votre dossier. Veuillez téléverser les documents manquants dans votre espace documents.",
          timestamp: "Hier, 10:15",
          isRead: false,
          files: [
            {
              name: "Liste_documents_requis.pdf",
              size: "145 KB",
              type: "pdf",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      contact: {
        name: "Expert Mobilité Internationale",
        title: "Conseiller spécialisé",
        avatar: "/avatar-7.jpg",
        isAdmin: true,
      },
      lastMessage: {
        content:
          "Voici les informations concernant les programmes d'accompagnement disponibles dans votre région cible.",
        timestamp: "Lundi",
        isFromUser: false,
      },
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: {
            name: "Expert Mobilité Internationale",
            avatar: "/avatar-7.jpg",
            isAdmin: true,
          },
          content:
            "Bonjour, suite à l'analyse de votre profil, j'ai identifié plusieurs programmes qui pourraient correspondre à votre projet. Voici les informations concernant les programmes d'accompagnement disponibles dans votre région cible.",
          timestamp: "Lundi, 09:45",
          isRead: true,
          files: [
            {
              name: "Programmes_Canada_2023.pdf",
              size: "320 KB",
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
            "Merci beaucoup pour ces informations précieuses. Le programme Destination Canada semble particulièrement adapté à mon projet.",
          timestamp: "Lundi, 11:30",
          isRead: true,
        },
      ],
    },
  ];

  return (
    <MessagingSystem
      initialConversations={otherConversations}
      title="Messages"
    />
  );
}
