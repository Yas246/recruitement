"use client";

import Calendar, { Event } from "@/app/components/Calendar";
import { useState } from "react";

export default function CalendarPage() {
  // Événements fictifs pour la démo
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Entretien de candidature",
      description:
        "Entretien avec le responsable des admissions pour évaluer votre candidature",
      date: "2023-06-15",
      time: "14:00",
      type: "meeting",
      location: "Salle B304 / Visioconférence",
      isImportant: true,
    },
    {
      id: 2,
      title: "Date limite soumission documents",
      description:
        "Date limite pour soumettre tous les documents requis pour votre dossier de candidature",
      date: "2023-06-20",
      time: "23:59",
      type: "deadline",
      isImportant: true,
    },
    {
      id: 3,
      title: "Webinaire d&apos;information",
      description: "Présentation du programme et des opportunités à l'étranger",
      date: "2023-06-10",
      time: "18:00",
      type: "info",
      link: "https://zoom.us/j/123456789",
    },
    {
      id: 4,
      title: "Atelier CV en anglais",
      description:
        "Apprenez à rédiger un CV efficace pour les universités anglophones",
      date: "2023-06-22",
      time: "15:30",
      type: "workshop",
      location: "Salle des conférences",
      link: "https://teams.microsoft.com/l/meetup-join/...",
    },
    {
      id: 5,
      title: "Présentation des résultats",
      description:
        "Annonce des étudiants sélectionnés pour le programme d'échange",
      date: "2023-06-30",
      time: "10:00",
      type: "info",
      link: "https://zoom.us/j/987654321",
    },
  ]);

  return <Calendar events={events} title="Calendrier Étudiant" />;
}
