"use client";

import Calendar, { Event } from "@/app/components/Calendar";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { useEffect, useState } from "react";
import { seedEvents } from "./eventSeeder";

// Type d'événement pour le calendrier étudiant
export interface StudentEvent extends FirestoreDocument {
  studentId: string;
  eventId: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "deadline" | "meeting" | "info" | "workshop";
  link?: string;
  location?: string;
  isImportant?: boolean;
  adminId?: string;
  status?: "pending" | "confirmed" | "cancelled";
  meetingType?: string;
}

export default function StudentCalendarPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fonction pour charger les événements de l'étudiant depuis Firestore
  const loadEvents = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      // 1. Charger les événements réguliers
      const eventsCollection = `students/${user.uid}/events`;
      const studentEvents =
        await firestoreService.getAllDocuments<StudentEvent>(eventsCollection);

      // 2. Charger les rendez-vous administratifs
      const adminMeetingsCollection = `students/${user.uid}/adminMeetings`;
      const adminMeetings =
        await firestoreService.getAllDocuments<StudentEvent>(
          adminMeetingsCollection
        );

      console.log(
        `Événements récupérés: ${studentEvents?.length || 0} réguliers, ${
          adminMeetings?.length || 0
        } administratifs`
      );

      // Combiner et formater tous les événements
      const allEvents = [
        ...(studentEvents || []).map(formatEvent),
        ...(adminMeetings || []).map((event) => ({
          ...formatEvent(event),
          type: "meeting",
          isImportant: true,
        })),
      ] as Event[];

      if (allEvents.length > 0) {
        setEvents(allEvents);
        toast.success("Calendrier mis à jour avec succès");
      } else {
        setEvents([]);
        toast.info("Aucun événement trouvé dans votre calendrier");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      toast.error("Impossible de charger vos événements");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour formater un événement
  const formatEvent = (event: StudentEvent): Event => {
    return {
      id: event.eventId,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      link: event.link,
      location: event.location,
      isImportant: event.isImportant,
    };
  };

  // Fonction pour générer des événements de test
  const handleGenerateEvents = async () => {
    if (!user?.uid) {
      toast.error("Vous devez être connecté pour générer des événements");
      return;
    }

    setIsGenerating(true);
    try {
      toast.info("Génération des événements pour le mois en cours...");
      const success = await seedEvents(user.uid);
      if (success) {
        toast.success("Événements de test générés avec succès");
        await loadEvents(); // Recharger les événements
      } else {
        toast.error("Impossible de générer les événements de test");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la génération des événements de test:",
        error
      );
      toast.error(
        "Une erreur est survenue lors de la génération des événements"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mon Calendrier</h1>
        <div className="flex space-x-2">
          <button
            onClick={loadEvents}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Chargement...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualiser
              </>
            )}
          </button>
          <button
            onClick={handleGenerateEvents}
            disabled={isGenerating}
            className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md flex items-center"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Génération...
              </>
            ) : (
              "Générer des événements de test"
            )}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucun événement trouvé dans votre calendrier.
            </p>
            <button
              onClick={handleGenerateEvents}
              disabled={isGenerating}
              className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md"
            >
              {isGenerating
                ? "Génération..."
                : "Générer des événements de test"}
            </button>
          </div>
        ) : (
          <Calendar events={events} title="Mon Calendrier Personnel" />
        )}
      </div>
    </div>
  );
}
