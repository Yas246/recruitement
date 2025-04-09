"use client";

import Calendar, { Event } from "@/app/components/Calendar";
import { useState } from "react";

export default function ArtistCalendarPage() {
  // Événements fictifs pour la démo adaptés au contexte artistique
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Audition Festival International",
      description:
        "Audition pour participation au Festival International des Arts de Paris",
      date: "2023-06-12",
      time: "14:00",
      type: "meeting",
      location: "Centre Culturel Georges Pompidou",
      isImportant: true,
    },
    {
      id: 2,
      title: "Date limite soumission portfolio",
      description:
        "Date limite pour soumettre votre portfolio pour l'exposition 'Nouveaux Talents'",
      date: "2023-06-18",
      time: "23:59",
      type: "deadline",
      isImportant: true,
    },
    {
      id: 3,
      title: "Webinaire sur les droits d'auteur",
      description:
        "Présentation des aspects juridiques pour les artistes internationaux",
      date: "2023-06-20",
      time: "18:00",
      type: "info",
      link: "https://zoom.us/j/123456789",
    },
    {
      id: 4,
      title: "Atelier création numérique",
      description:
        "Atelier pratique sur les outils de création numérique pour artistes",
      date: "2023-06-24",
      time: "10:00",
      type: "workshop",
      location: "Maison des Arts Numériques",
      link: "https://teams.microsoft.com/l/meetup-join/...",
    },
    {
      id: 5,
      title: "Vernissage exposition collective",
      description:
        "Présentation des œuvres sélectionnées pour l'exposition internationale",
      date: "2023-06-28",
      time: "19:00",
      type: "meeting",
      location: "Galerie d'Art Contemporain",
    },
    {
      id: 6,
      title: "Performance live streaming",
      description:
        "Performance en direct pour le public international - préparation technique à 16h",
      date: "2023-07-02",
      time: "18:00",
      type: "meeting",
      location: "Studio 42",
      link: "https://livestream.com/channel/performance",
      isImportant: true,
    },
    {
      id: 7,
      title: "Rencontre avec galeriste",
      description:
        "Entretien avec M. Leroy, galeriste spécialisé dans l'art contemporain",
      date: "2023-07-05",
      time: "11:30",
      type: "meeting",
      location: "Café des Artistes",
    },
    {
      id: 8,
      title: "Date limite candidature résidence artistique",
      description:
        "Dernier jour pour postuler à la résidence artistique de Berlin",
      date: "2023-07-10",
      time: "23:59",
      type: "deadline",
      isImportant: true,
    },
  ]);

  return <Calendar events={events} title="Calendrier Artistique" />;
}
