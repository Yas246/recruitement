/* eslint-disable */
"use client";

import Calendar, { Event as CalendarEvent } from "@/app/components/Calendar";
import { EventStatus, EventType } from "@/app/components/Calendar/types";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { CustomDate } from "@/app/utils/CustomDate";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { Timestamp, where } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiCalendar, FiFilter, FiPlus, FiUsers } from "react-icons/fi";

// Type d'événement pour le calendrier administrateur
interface AdminEvent extends FirestoreDocument {
  userId: string;
  userType: "student" | "worker" | "artist" | "all";
  userName?: string;
  eventId: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: EventType;
  link?: string;
  location?: string;
  isImportant?: boolean;
  status?: EventStatus;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Interface pour les utilisateurs
interface User extends FirestoreDocument {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  role: "student" | "worker" | "artist";
}

// Dans l'initialisation du state, utilisez une fonction pour réinitialiser le formulaire
const defaultEventState = {
  title: "",
  description: "",
  date: CustomDate.today().toString(),
  time: "10:00",
  type: "info" as EventType,
  location: "",
  link: "",
  isImportant: false,
  userId: "all",
  userType: "all" as "student" | "worker" | "artist" | "all",
};

export default function AdminCalendarPage() {
  const toast = useToast();
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [selectedUserType, setSelectedUserType] = useState<
    "student" | "worker" | "artist" | "all"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState(defaultEventState);

  // Utiliser cette fonction pour initialiser et réinitialiser le formulaire
  const resetEventForm = () => {
    setNewEvent({ ...defaultEventState });
  };

  // Récupérer tous les utilisateurs (étudiants et workers)
  const fetchUsers = async () => {
    try {
      const usersCollection = await firestoreService.queryDocuments<User>(
        "users",
        [where("role", "in", ["student", "worker", "artist"])]
      );

      if (usersCollection) {
        const fetchedUsers = usersCollection.map((doc) => ({
          id: doc.id,
          firstName: doc.firstName,
          lastName: doc.lastName,
          displayName: doc.displayName || `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          role: doc.role as "student" | "worker" | "artist",
        }));

        setUsers(fetchedUsers);
        console.log(`Récupéré ${fetchedUsers.length} utilisateurs`);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast.error("Impossible de récupérer la liste des utilisateurs");
    }
  };

  // Récupérer tous les événements
  const fetchEvents = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      let allEvents: AdminEvent[] = [];

      // Si un utilisateur spécifique est sélectionné
      if (selectedUserId !== "all") {
        console.log(
          "=== Chargement des événements pour un utilisateur spécifique ==="
        );
        const selectedUser = users.find((u) => u.id === selectedUserId);
        if (selectedUser) {
          const userEventsCollection = `${selectedUser.role}s/${selectedUserId}/events`;
          const eventsFromFirestore =
            await firestoreService.getAllDocuments<AdminEvent>(
              userEventsCollection
            );

          if (eventsFromFirestore) {
            console.log("Événements bruts de Firestore:", eventsFromFirestore);
            allEvents = eventsFromFirestore.map((event) => ({
              ...event,
              userName: selectedUser.displayName,
              userType: selectedUser.role,
            }));
            console.log("Événements après transformation:", allEvents);
          }
        }
      } else {
        console.log("=== Chargement des événements globaux ===");
        // 1. Récupérer les événements globaux (pour tous)
        const eventsCollection = "events";
        const globalEvents = await firestoreService.getAllDocuments<AdminEvent>(
          eventsCollection
        );

        if (globalEvents) {
          console.log("Événements globaux:", globalEvents);
          allEvents = [...allEvents, ...globalEvents];
        }

        // 2. Si le type d'utilisateur est "all" ou spécifique, récupérer tous les événements utilisateurs
        if (users.length > 0) {
          console.log("=== Chargement des événements utilisateurs ===");
          // Récupérer les événements de tous les utilisateurs filtrés par type si nécessaire
          const filteredUsers = users.filter(
            (u) => selectedUserType === "all" || u.role === selectedUserType
          );

          for (const user of filteredUsers) {
            const userEventsCollection = `${user.role}s/${user.id}/events`;
            try {
              const userEvents =
                await firestoreService.getAllDocuments<AdminEvent>(
                  userEventsCollection
                );
              if (userEvents && userEvents.length > 0) {
                console.log(`Événements pour ${user.displayName}:`, userEvents);
                const eventsWithUserInfo = userEvents.map((event) => ({
                  ...event,
                  userName: user.displayName,
                  userType: user.role,
                }));
                allEvents = [...allEvents, ...eventsWithUserInfo];
              }
            } catch (error) {
              console.error(
                `Erreur lors de la récupération des événements pour l'utilisateur ${user.id}:`,
                error
              );
            }
          }
        }
      }

      console.log("=== Transformation des événements pour le calendrier ===");
      console.log("Événements avant transformation:", allEvents);

      // Transformation des événements pour le composant Calendar avec correction de la date
      const formattedEvents: CalendarEvent[] = allEvents.map((event) => {
        const formattedEvent = {
          id:
            typeof event.eventId === "number"
              ? event.eventId
              : parseInt(String(event.eventId || "0")),
          title: event.title,
          description: `${event.description}\n\n${
            event.userType === "all"
              ? "Pour tous"
              : event.userType === "student"
              ? "Pour les étudiants"
              : event.userType === "worker"
              ? "Pour les travailleurs"
              : "Pour les artistes"
          }${event.userName ? ` : ${event.userName}` : ""}`,
          date: event.date,
          time: event.time,
          type: (event.type === "admin_meeting" ? "meeting" : event.type) as
            | "meeting"
            | "deadline"
            | "workshop"
            | "info",
          link: event.link,
          location: event.location,
          isImportant: event.isImportant || false,
        };
        console.log("Événement transformé:", {
          original: event.date,
          transformed: formattedEvent.date,
          event: formattedEvent,
        });
        return formattedEvent;
      });

      console.log("Événements finaux chargés:", formattedEvents.length);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      toast.error("Impossible de charger les événements du calendrier.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un nouvel événement
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== Début création événement ===");
    console.log("Données du formulaire:", newEvent);

    if (!user?.uid || !isAdmin) {
      toast.error("Vous n'avez pas les droits pour ajouter un événement");
      return;
    }

    try {
      const now = new Date();
      const eventDate = CustomDate.fromString(newEvent.date);
      console.log("Date de l'événement:", {
        original: newEvent.date,
        parsed: eventDate.toString(),
        customDateObject: {
          year: eventDate.year,
          month: eventDate.month,
          day: eventDate.day,
        },
      });

      const eventBase = {
        ...newEvent,
        date: eventDate.toString(), // Utiliser notre format personnalisé
        createdAt: now,
        updatedAt: now,
        createdBy: user.uid,
      };
      console.log("Event base:", eventBase);

      // Si l'événement est pour tous les utilisateurs
      if (newEvent.userId === "all") {
        const eventId = Date.now() + Math.floor(Math.random() * 1000);
        const eventData = {
          ...eventBase,
          userId: "all",
          userType: newEvent.userType,
          eventId,
        };
        console.log("Création événement pour tous:", eventData);

        await toast.promise(firestoreService.addDocument("events", eventData), {
          loading: "Ajout de l'événement...",
          success: "Événement ajouté avec succès",
          error: "Impossible d'ajouter l'événement",
        });
      } else {
        // Si l'événement est pour un utilisateur spécifique
        const targetUser = users.find((u) => u.id === newEvent.userId);
        if (targetUser) {
          const userEventsCollection = `${targetUser.role}s/${targetUser.id}/events`;
          const eventId = Date.now() + Math.floor(Math.random() * 1000);

          const eventData = {
            ...eventBase,
            userId: targetUser.id,
            userType: targetUser.role,
            eventId,
          };
          console.log("Création événement pour utilisateur spécifique:", {
            user: targetUser.id,
            role: targetUser.role,
            collection: userEventsCollection,
            eventData,
          });

          await toast.promise(
            firestoreService.addDocument(userEventsCollection, eventData),
            {
              loading: "Ajout de l'événement...",
              success: "Événement ajouté avec succès",
              error: "Impossible d'ajouter l'événement",
            }
          );
        }
      }

      // Réinitialiser le formulaire et fermer le modal
      console.log("=== Fin création événement ===");
      resetEventForm();
      setShowEventForm(false);

      // Recharger les événements
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      toast.error("Une erreur est survenue lors de l'ajout de l'événement");
    }
  };

  // Charger les utilisateurs et les événements au montage
  useEffect(() => {
    if (user?.uid && isAdmin) {
      fetchUsers();
    }
  }, [user?.uid, isAdmin]);

  useEffect(() => {
    if (users.length > 0) {
      fetchEvents();
    }
  }, [users, selectedUserId, selectedUserType]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Accès refusé
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Vous n'avez pas les droits pour accéder à cette page.
        </p>
        <Link
          href="/dashboard"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <FiCalendar className="text-2xl text-primary-600 dark:text-primary-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestion du Calendrier
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                <FiFilter className="text-gray-500 dark:text-gray-400" />
                <select
                  className="bg-transparent text-gray-700 dark:text-gray-300 text-sm focus:outline-none dark:bg-gray-700"
                  value={selectedUserType}
                  onChange={(e) =>
                    setSelectedUserType(
                      e.target.value as unknown as
                        | "student"
                        | "worker"
                        | "artist"
                        | "all"
                    )
                  }
                >
                  <option value="all">Tous les types</option>
                  <option value="student">Étudiants</option>
                  <option value="worker">Travailleurs</option>
                  <option value="artist">Artistes</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                <FiUsers className="text-gray-500 dark:text-gray-400" />
                <select
                  className="bg-transparent text-gray-700 dark:text-gray-300 text-sm focus:outline-none dark:bg-gray-700"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="all">Tous les utilisateurs</option>
                  {users
                    .filter(
                      (u) =>
                        selectedUserType === "all" ||
                        u.role === selectedUserType
                    )
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.displayName}
                      </option>
                    ))}
                </select>
              </div>
              <button
                onClick={() => setShowEventForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                <FiPlus />
                Ajouter un événement
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <Calendar events={events} title="Calendrier Administrateur" />
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ajouter un événement
                </h2>
                <button
                  onClick={() => {
                    resetEventForm();
                    setShowEventForm(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type d'utilisateur
                    </label>
                    <select
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      value={newEvent.userType}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          userType: e.target.value as unknown as
                            | "student"
                            | "worker"
                            | "artist"
                            | "all",
                          userId: "all",
                        })
                      }
                      required
                    >
                      <option value="all">Tous</option>
                      <option value="student">Étudiants</option>
                      <option value="worker">Travailleurs</option>
                      <option value="artist">Artistes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Utilisateur
                    </label>
                    <select
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      value={newEvent.userId}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, userId: e.target.value })
                      }
                      required
                    >
                      <option value="all">Tous</option>
                      {users
                        .filter(
                          (u) =>
                            newEvent.userType === "all" ||
                            u.role === newEvent.userType
                        )
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.displayName}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    required
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      value={newEvent.date}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Heure
                    </label>
                    <input
                      type="time"
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      value={newEvent.time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    value={newEvent.type}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        type: e.target.value as unknown as
                          | "info"
                          | "meeting"
                          | "deadline"
                          | "workshop",
                      })
                    }
                    required
                  >
                    <option value="info">Information</option>
                    <option value="meeting">Rendez-vous</option>
                    <option value="deadline">Date limite</option>
                    <option value="workshop">Atelier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lieu
                  </label>
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lien
                  </label>
                  <input
                    type="url"
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    value={newEvent.link}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, link: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isImportant"
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={newEvent.isImportant}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        isImportant: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="isImportant"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Marquer comme important
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetEventForm();
                      setShowEventForm(false);
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
