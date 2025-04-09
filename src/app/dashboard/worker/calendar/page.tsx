"use client";

import Calendar, { Event } from "@/app/components/Calendar";
import { useState } from "react";

export default function WorkerCalendarPage() {
  // Événements fictifs pour la démo adaptés au contexte professionnel
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Entretien d'embauche",
      description:
        "Entretien avec le responsable RH et le chef de projet pour le poste de développeur senior",
      date: "2023-06-15",
      time: "10:30",
      type: "meeting",
      location: "Salle de conférence A / Visioconférence",
      isImportant: true,
    },
    {
      id: 2,
      title: "Date limite documents administratifs",
      description:
        "Date limite pour soumettre tous les documents requis pour finaliser votre dossier",
      date: "2023-06-20",
      time: "18:00",
      type: "deadline",
      isImportant: true,
    },
    {
      id: 3,
      title: "Webinaire d'intégration",
      description: "Présentation de l'entreprise et des processus internes",
      date: "2023-06-22",
      time: "14:00",
      type: "info",
      link: "https://zoom.us/j/123456789",
    },
    {
      id: 4,
      title: "Formation initiale",
      description:
        "Formation sur les outils et technologies utilisées dans l'entreprise",
      date: "2023-06-25",
      time: "09:00",
      type: "workshop",
      location: "Salle de formation",
      link: "https://teams.microsoft.com/l/meetup-join/...",
    },
    {
      id: 5,
      title: "Réunion d'équipe",
      description:
        "Présentation des objectifs du trimestre et planification des projets",
      date: "2023-06-28",
      time: "11:00",
      type: "meeting",
      location: "Salle de réunion principale",
    },
    {
      id: 6,
      title: "Démarrage du contrat",
      description:
        "Premier jour officiel de travail - Session d'orientation avec le responsable RH",
      date: "2023-07-01",
      time: "09:00",
      type: "meeting",
      location: "Accueil de l'entreprise",
      isImportant: true,
    },
  ]);

  return <Calendar events={events} title="Calendrier Professionnel" />;
}
