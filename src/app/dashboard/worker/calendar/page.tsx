"use client";

import Calendar, { Event } from "@/app/components/Calendar";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { useEffect, useState } from "react";

interface CalendarEvent extends FirestoreDocument, Omit<Event, "id"> {
  workerId: string;
  createdBy: string;
  status: "pending" | "confirmed" | "cancelled";
}

export default function WorkerCalendarPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer les événements du worker depuis Firestore
        const workerEvents =
          await firestoreService.getAllDocuments<CalendarEvent>(
            `workers/${user.uid}/events`
          );

        // Convertir les événements Firestore en événements du calendrier
        const formattedEvents: Event[] = workerEvents.map((event, index) => ({
          id: index + 1, // Utiliser l'index comme ID numérique
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          type: event.type,
          location: event.location,
          link: event.link,
          isImportant: event.isImportant,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
        toast.error("Impossible de charger vos événements");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [user?.uid, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <Calendar events={events} title="Calendrier" />;
}
