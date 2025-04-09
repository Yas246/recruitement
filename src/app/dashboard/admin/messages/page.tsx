"use client";

import Link from "next/link";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isFromAdmin: boolean;
}

interface Conversation {
  id: string;
  userName: string;
  userEmail: string;
  userType: "student" | "worker" | "artist";
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  status: "active" | "resolved" | "pending";
  messages: Message[];
}

export default function AdminMessages() {
  // Données factices pour les conversations
  const [conversations] = useState<Conversation[]>([
    {
      id: "CONV001",
      userName: "Emma Bernard",
      userEmail: "emma.bernard@exemple.com",
      userType: "student",
      lastMessage: "Merci pour les informations complémentaires",
      lastMessageDate: "2023-06-02T14:30:00",
      unreadCount: 0,
      status: "active",
      messages: [
        {
          id: "MSG001",
          content:
            "Bonjour, j'aurais besoin d'informations sur la procédure de candidature au programme d'échange avec l'université de Toronto.",
          timestamp: "2023-06-01T10:15:00",
          isFromAdmin: false,
        },
        {
          id: "MSG002",
          content:
            "Bonjour Emma, je vous envoie les informations concernant le programme d'échange avec Toronto. Vous devez d'abord soumettre votre dossier académique et une lettre de motivation avant le 15 juin.",
          timestamp: "2023-06-01T11:20:00",
          isFromAdmin: true,
        },
        {
          id: "MSG003",
          content: "Merci pour les informations complémentaires",
          timestamp: "2023-06-02T14:30:00",
          isFromAdmin: false,
        },
      ],
    },
    {
      id: "CONV002",
      userName: "Thomas Martin",
      userEmail: "thomas.martin@exemple.com",
      userType: "worker",
      lastMessage: "D'accord, je vous fournirai ces documents d'ici demain.",
      lastMessageDate: "2023-06-01T16:45:00",
      unreadCount: 2,
      status: "pending",
      messages: [
        {
          id: "MSG004",
          content:
            "Bonjour, je souhaite postuler pour le poste de développeur frontend senior à Berlin. J'ai déjà téléchargé mon CV mais j'ai quelques questions sur les documents requis.",
          timestamp: "2023-06-01T15:10:00",
          isFromAdmin: false,
        },
        {
          id: "MSG005",
          content:
            "Bonjour Thomas, en plus de votre CV, nous avons besoin d'une copie de votre passeport, de vos diplômes et de vos certificats pertinents pour la position.",
          timestamp: "2023-06-01T15:30:00",
          isFromAdmin: true,
        },
        {
          id: "MSG006",
          content: "D'accord, je vous fournirai ces documents d'ici demain.",
          timestamp: "2023-06-01T16:45:00",
          isFromAdmin: false,
        },
      ],
    },
    {
      id: "CONV003",
      userName: "Sophie Durand",
      userEmail: "sophie.durand@exemple.com",
      userType: "artist",
      lastMessage:
        "Je viens de mettre à jour mon portfolio avec mes dernières créations.",
      lastMessageDate: "2023-06-02T09:45:00",
      unreadCount: 3,
      status: "active",
      messages: [
        {
          id: "MSG007",
          content:
            "Bonjour, j'aimerais savoir s'il est encore possible de postuler pour l'exposition internationale de Tokyo en septembre?",
          timestamp: "2023-06-01T09:15:00",
          isFromAdmin: false,
        },
        {
          id: "MSG008",
          content:
            "Bonjour Sophie, oui les candidatures sont encore ouvertes jusqu'au 20 juin. Nous recommandons vivement de mettre à jour votre portfolio avec vos œuvres les plus récentes.",
          timestamp: "2023-06-01T10:00:00",
          isFromAdmin: true,
        },
        {
          id: "MSG009",
          content:
            "Je viens de mettre à jour mon portfolio avec mes dernières créations.",
          timestamp: "2023-06-02T09:45:00",
          isFromAdmin: false,
        },
      ],
    },
    {
      id: "CONV004",
      userName: "Lucas Petit",
      userEmail: "lucas.petit@exemple.com",
      userType: "student",
      lastMessage: "Merci beaucoup pour cette opportunité !",
      lastMessageDate: "2023-06-01T12:25:00",
      unreadCount: 0,
      status: "resolved",
      messages: [
        {
          id: "MSG010",
          content:
            "Bonjour, je viens de recevoir la confirmation de mon acceptation au programme. Quelle est la prochaine étape?",
          timestamp: "2023-06-01T11:40:00",
          isFromAdmin: false,
        },
        {
          id: "MSG011",
          content:
            "Félicitations Lucas! La prochaine étape est de confirmer votre participation en remplissant le formulaire d'acceptation avant le 10 juin. Vous recevrez ensuite les détails pour la planification de votre voyage et votre logement.",
          timestamp: "2023-06-01T12:10:00",
          isFromAdmin: true,
        },
        {
          id: "MSG012",
          content: "Merci beaucoup pour cette opportunité !",
          timestamp: "2023-06-01T12:25:00",
          isFromAdmin: false,
        },
      ],
    },
    {
      id: "CONV005",
      userName: "Julie Moreau",
      userEmail: "julie.moreau@exemple.com",
      userType: "worker",
      lastMessage:
        "J'ai bien reçu la confirmation. À bientôt pour l'entretien.",
      lastMessageDate: "2023-05-31T15:20:00",
      unreadCount: 0,
      status: "resolved",
      messages: [
        {
          id: "MSG013",
          content:
            "Bonjour, suite à mon entretien de la semaine dernière, je voulais savoir si vous aviez des nouvelles de ma candidature?",
          timestamp: "2023-05-31T14:50:00",
          isFromAdmin: false,
        },
        {
          id: "MSG014",
          content:
            "Bonjour Julie, votre candidature a été retenue pour la phase suivante. Nous aimerions vous inviter à un second entretien le 10 juin à 14h00 avec le responsable du département. Êtes-vous disponible?",
          timestamp: "2023-05-31T15:10:00",
          isFromAdmin: true,
        },
        {
          id: "MSG015",
          content:
            "J'ai bien reçu la confirmation. À bientôt pour l'entretien.",
          timestamp: "2023-05-31T15:20:00",
          isFromAdmin: false,
        },
      ],
    },
  ]);

  // État pour la conversation active
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // État pour le nouveau message
  const [newMessage, setNewMessage] = useState("");

  // Fonction pour filtrer les conversations
  const filteredConversations = conversations.filter((conv) => {
    // Filtrer par terme de recherche
    const searchMatch =
      conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrer par type d'utilisateur
    const typeMatch = typeFilter === "all" || conv.userType === typeFilter;

    // Filtrer par statut
    const statusMatch = statusFilter === "all" || conv.status === statusFilter;

    return searchMatch && typeMatch && statusMatch;
  });

  // Fonction pour obtenir la classe de badge en fonction du type d'utilisateur
  const getUserTypeBadgeClass = (type: string) => {
    switch (type) {
      case "student":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "worker":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "artist":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Fonction pour obtenir l'étiquette du type d'utilisateur
  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "student":
        return "Étudiant";
      case "worker":
        return "Travailleur";
      case "artist":
        return "Artiste";
      default:
        return type;
    }
  };

  // Fonction pour obtenir la classe de badge en fonction du statut
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "resolved":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Fonction pour obtenir l'étiquette du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "pending":
        return "En attente";
      case "resolved":
        return "Résolu";
      default:
        return status;
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour gérer l'envoi d'un nouveau message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    // Implémenter l'envoi du message
    alert(`Message envoyé à ${activeConversation.userName}: "${newMessage}"`);
    setNewMessage("");
  };

  // Fonction pour marquer une conversation comme résolue
  const markAsResolved = (conversationId: string) => {
    // Implémenter la logique pour marquer comme résolu
    alert(`Conversation ${conversationId} marquée comme résolue`);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des messages
          </h1>
          <Link href="/dashboard/admin" className="btn-primary">
            Tableau de bord
          </Link>
        </div>

        <div className="flex flex-grow h-full overflow-hidden">
          {/* Liste des conversations */}
          <div className="w-1/3 glass-card mr-4 flex flex-col overflow-hidden">
            {/* Filtres de recherche */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white mb-2"
              />
              <div className="flex space-x-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tous les types</option>
                  <option value="student">Étudiants</option>
                  <option value="worker">Travailleurs</option>
                  <option value="artist">Artistes</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="pending">En attente</option>
                  <option value="resolved">Résolus</option>
                </select>
              </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-grow overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      activeConversation?.id === conv.id
                        ? "bg-gray-100 dark:bg-gray-800/70"
                        : ""
                    }`}
                    onClick={() => setActiveConversation(conv)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {conv.userName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {conv.userEmail}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(conv.lastMessageDate).toLocaleDateString()}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="mt-1 px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[70%]">
                        {conv.lastMessage}
                      </p>
                      <div className="flex space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getUserTypeBadgeClass(
                            conv.userType
                          )}`}
                        >
                          {getUserTypeLabel(conv.userType)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                            conv.status
                          )}`}
                        >
                          {getStatusLabel(conv.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-700 dark:text-gray-300">
                  Aucune conversation ne correspond à vos critères de recherche.
                </div>
              )}
            </div>
          </div>

          {/* Fenêtre de conversation */}
          <div className="w-2/3 glass-card flex flex-col overflow-hidden">
            {activeConversation ? (
              <>
                {/* En-tête de la conversation */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-lg">
                      {activeConversation.userName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {activeConversation.userEmail}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getUserTypeBadgeClass(
                        activeConversation.userType
                      )}`}
                    >
                      {getUserTypeLabel(activeConversation.userType)}
                    </span>
                    <button
                      onClick={() => markAsResolved(activeConversation.id)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        activeConversation.status === "resolved"
                          ? "bg-gray-100 text-gray-700 cursor-default dark:bg-gray-900/30 dark:text-gray-400"
                          : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                      }`}
                      disabled={activeConversation.status === "resolved"}
                    >
                      {activeConversation.status === "resolved"
                        ? "Résolu"
                        : "Marquer comme résolu"}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isFromAdmin ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isFromAdmin
                            ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulaire de réponse */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="btn-primary px-4 py-2"
                      disabled={!newMessage.trim()}
                    >
                      Envoyer
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Sélectionnez une conversation pour afficher les messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
