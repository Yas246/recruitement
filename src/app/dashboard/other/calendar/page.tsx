"use client";

import Calendar, { Event } from "@/app/components/Calendar";
import { useState } from "react";

export default function OtherCalendarPage() {
  // Événements fictifs pour la démo adaptés au contexte "other"
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Entretien de présentation",
      description:
        "Entretien avec un conseiller OMSHINA pour discuter de votre projet et des possibilités d'accompagnement",
      date: "2023-06-15",
      time: "14:00",
      type: "meeting",
      location: "Visioconférence",
      isImportant: true,
    },
    {
      id: 2,
      title: "Date limite documents",
      description:
        "Date limite pour soumettre tous les documents requis pour votre dossier",
      date: "2023-06-20",
      time: "23:59",
      type: "deadline",
      isImportant: true,
    },
    {
      id: 3,
      title: "Webinaire Destination Canada",
      description:
        "Présentation des opportunités et des démarches pour s'établir au Canada",
      date: "2023-06-22",
      time: "18:00",
      type: "info",
      link: "https://zoom.us/j/123456789",
    },
    {
      id: 4,
      title: "Atelier démarches administratives",
      description:
        "Session pratique sur les démarches administratives pour préparer votre projet international",
      date: "2023-06-25",
      time: "10:00",
      type: "workshop",
      location: "Centre OMSHINA Paris",
      link: "https://teams.microsoft.com/l/meetup-join/...",
    },
    {
      id: 5,
      title: "Suivi personnalisé",
      description:
        "Point d'étape sur l'avancement de votre dossier avec votre conseiller référent",
      date: "2023-06-28",
      time: "15:30",
      type: "meeting",
      location: "Téléphone",
    },
    {
      id: 6,
      title: "Forum des expatriés",
      description:
        "Rencontre avec des professionnels et des personnes déjà installées dans le pays de destination",
      date: "2023-07-05",
      time: "09:00",
      type: "info",
      location: "Palais des Congrès",
      isImportant: true,
    },
    {
      id: 7,
      title: "Réunion préparation départ",
      description:
        "Réunion pour préparer les dernières étapes avant votre départ à l'international",
      date: "2023-07-15",
      time: "14:00",
      type: "meeting",
      location: "Centre OMSHINA Paris",
    },
  ]);

  return <Calendar events={events} title="Mon Calendrier" />;
}
