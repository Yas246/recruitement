"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../utils/responsive";

export interface MessageFile {
  name: string;
  size: string;
  type: string;
}

export interface Message {
  id: number;
  sender: {
    name: string;
    avatar?: string;
    isAdmin?: boolean;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  files?: MessageFile[];
}

export interface Conversation {
  id: number;
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
  messages: Message[];
}

interface MessagingSystemProps {
  initialConversations: Conversation[];
  title?: string;
}

export default function MessagingSystem({
  initialConversations,
  title = "Messages",
}: MessagingSystemProps) {
  // Détecter si l'appareil est mobile
  const isMobile = useIsMobile();

  // État pour les conversations
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);

  // État pour la conversation active
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(
      conversations.length > 0 ? conversations[0] : null
    );

  // État pour le message en cours de rédaction
  const [newMessage, setNewMessage] = useState("");

  // État pour afficher la liste des conversations sur mobile
  const [showConversationList, setShowConversationList] = useState(true);

  // Référence pour le conteneur de messages pour scroll automatique
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation?.messages]);

  // Sur mobile, afficher la liste des conversations par défaut
  useEffect(() => {
    if (isMobile) {
      setShowConversationList(!activeConversation);
    } else {
      setShowConversationList(true);
    }
  }, [isMobile, activeConversation]);

  // Gestion de l'envoi d'un nouveau message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeConversation) return;

    const updatedMessage: Message = {
      id: Date.now(),
      sender: {
        name: "Vous",
      },
      content: newMessage,
      timestamp: "À l&apos;instant",
      isRead: true,
    };

    // Mise à jour de la conversation active
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, updatedMessage],
      lastMessage: {
        content: newMessage,
        timestamp: "À l&apos;instant",
        isFromUser: true,
      },
    };

    // Mise à jour de toutes les conversations
    setConversations(
      conversations.map((conv) =>
        conv.id === activeConversation.id ? updatedConversation : conv
      )
    );

    // Mise à jour de la conversation active
    setActiveConversation(updatedConversation);

    // Réinitialisation du champ de message
    setNewMessage("");
  };

  // Marquer une conversation comme lue
  const markAsRead = (conversationId: number) => {
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        const updatedMessages = conv.messages.map((msg) => ({
          ...msg,
          isRead: true,
        }));

        return {
          ...conv,
          messages: updatedMessages,
          unreadCount: 0,
        };
      }
      return conv;
    });

    setConversations(updatedConversations);

    // Mise à jour de la conversation active si nécessaire
    if (activeConversation && activeConversation.id === conversationId) {
      const updatedActiveConv = updatedConversations.find(
        (conv) => conv.id === conversationId
      );
      if (updatedActiveConv) {
        setActiveConversation(updatedActiveConv);
      }
    }
  };

  // Sélectionner une conversation et masquer la liste sur mobile
  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    markAsRead(conversation.id);

    if (isMobile) {
      setShowConversationList(false);
    }
  };

  // Retour à la liste des conversations sur mobile
  const handleBackToList = () => {
    setShowConversationList(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {title}
      </h1>

      <div className="glass-card p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Liste des conversations */}
          {(showConversationList || !isMobile) && (
            <div
              className={`${
                isMobile ? "w-full" : "w-full md:w-1/3"
              } border-r border-gray-200 dark:border-gray-700`}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-gray-900 dark:text-white">
                  Conversations
                </h2>
              </div>

              <div className="overflow-y-auto h-[calc(600px-57px)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer ${
                      activeConversation?.id === conversation.id
                        ? "bg-gray-50 dark:bg-gray-800/30"
                        : ""
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {conversation.contact.avatar ? (
                          <img
                            src={conversation.contact.avatar}
                            alt={conversation.contact.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                            {conversation.contact.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {conversation.contact.name}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conversation.lastMessage.timestamp}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {conversation.lastMessage.isFromUser ? "Vous: " : ""}
                          {conversation.lastMessage.content}
                        </p>

                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conversation.contact.title}
                          </span>

                          {conversation.unreadCount > 0 && (
                            <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversation active */}
          {(!showConversationList || !isMobile) && activeConversation && (
            <div
              className={`${
                isMobile ? "w-full" : "w-full md:w-2/3"
              } flex flex-col`}
            >
              {/* En-tête de la conversation */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                {isMobile && (
                  <button
                    onClick={handleBackToList}
                    className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Retour à la liste"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {activeConversation.contact.avatar ? (
                  <img
                    src={activeConversation.contact.avatar}
                    alt={activeConversation.contact.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mr-3">
                    {activeConversation.contact.name.charAt(0)}
                  </div>
                )}

                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    {activeConversation.contact.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeConversation.contact.title}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender.name === "Vous"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.sender.name === "Vous" ? "" : "flex"
                        }`}
                      >
                        {message.sender.name !== "Vous" && (
                          <div className="flex-shrink-0 mr-3">
                            {message.sender.avatar ? (
                              <img
                                src={message.sender.avatar}
                                alt={message.sender.name}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                                {message.sender.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender.name === "Vous"
                                ? "bg-primary-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <p
                              className={
                                message.sender.name === "Vous"
                                  ? "text-white"
                                  : "text-gray-900 dark:text-white"
                              }
                            >
                              {message.content}
                            </p>

                            {message.files && message.files.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.files.map((file, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center p-2 rounded ${
                                      message.sender.name === "Vous"
                                        ? "bg-primary-700"
                                        : "bg-gray-200 dark:bg-gray-700"
                                    }`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 mr-2"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-sm truncate ${
                                          message.sender.name === "Vous"
                                            ? "text-white"
                                            : "text-gray-900 dark:text-white"
                                        }`}
                                      >
                                        {file.name}
                                      </p>
                                      <p
                                        className={`text-xs ${
                                          message.sender.name === "Vous"
                                            ? "text-primary-200"
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      >
                                        {file.size}
                                      </p>
                                    </div>
                                    <button
                                      className={`text-xs px-2 py-1 rounded ${
                                        message.sender.name === "Vous"
                                          ? "bg-primary-800 text-white hover:bg-primary-900"
                                          : "bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                      }`}
                                    >
                                      Télécharger
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <p
                            className={`text-xs mt-1 ${
                              message.sender.name === "Vous" ? "text-right" : ""
                            } text-gray-500 dark:text-gray-400`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Div invisible pour auto-scroll */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Formulaire d'envoi */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center"
                >
                  <button
                    type="button"
                    className="p-2 rounded-full text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <input
                    type="text"
                    className="flex-1 mx-3 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Écrivez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="p-2 rounded-full text-white bg-primary-600 hover:bg-primary-700"
                    disabled={!newMessage.trim()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Etat vide - pas de conversation sélectionnée */}
          {(!showConversationList || !isMobile) && !activeConversation && (
            <div className="w-full md:w-2/3 flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  Aucune conversation sélectionnée
                </h3>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Sélectionnez une conversation pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
