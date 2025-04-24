import { CustomDate } from "@/app/utils/CustomDate";
import { Event, EventDay } from "./types";

// Jours de la semaine en français (commençant par Lundi)
const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Fonction pour obtenir la classe CSS en fonction du type d'événement
export const getEventTypeClass = (type: Event["type"]) => {
  switch (type) {
    case "meeting":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "deadline":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "workshop":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "info":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "admin_meeting":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-2 border-amber-500";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// Fonction pour obtenir l'icône en fonction du type d'événement
export const getEventTypeIcon = (type: Event["type"]) => {
  switch (type) {
    case "meeting":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "deadline":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "workshop":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      );
    case "info":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "admin_meeting":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
};

// Générer des jours du mois pour un mois spécifique
export const generateMonthDays = (
  events: Event[],
  targetDate: Date = new Date()
) => {
  console.log("=== Génération des jours du mois ===");
  console.log("Date cible:", {
    raw: targetDate,
    year: targetDate.getFullYear(),
    month: targetDate.getMonth() + 1,
    day: targetDate.getDate(),
  });

  // Convertir la date cible en CustomDate
  const customDate = CustomDate.fromDate(targetDate);
  console.log("CustomDate:", {
    year: customDate.year,
    month: customDate.month,
    day: customDate.day,
    toString: customDate.toString(),
  });

  const currentYear = customDate.year;
  const currentMonth = customDate.month;

  // Obtenir le nombre de jours dans le mois
  const daysInMonth = CustomDate.getDaysInMonth(currentYear, currentMonth);
  console.log("Configuration du mois:", {
    année: currentYear,
    mois: currentMonth,
    nombreJours: daysInMonth,
  });

  const monthDays: EventDay[] = [];

  // Obtenir le premier jour du mois (0 = Dimanche, 1 = Lundi, etc.)
  const firstDayDate = new Date(currentYear, currentMonth - 1, 1);
  const firstDayOfMonth = firstDayDate.getDay();
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  console.log("Premier jour du mois:", {
    date: firstDayDate.toLocaleDateString(),
    jourSemaine: firstDayOfMonth,
    joursAvant: startingDay,
  });

  // Ajouter les jours du mois précédent
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = CustomDate.getDaysInMonth(prevYear, prevMonth);

  for (let i = startingDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new CustomDate(prevYear, prevMonth, day);
    const dateString = date.toString();

    // Filtrer les événements pour ce jour
    const dayEvents = events.filter((event) => {
      const match = event.date === dateString;
      if (match) {
        console.log("Événement trouvé pour jour précédent:", {
          date: dateString,
          event: event,
        });
      }
      return match;
    });

    const dayDate = new Date(prevYear, prevMonth - 1, day);
    monthDays.push({
      date: dateString,
      formattedDate: String(day),
      dayName: weekdays[dayDate.getDay()],
      events: dayEvents,
      isCurrentMonth: false,
    });
  }

  // Générer les jours du mois actuel
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new CustomDate(currentYear, currentMonth, i);
    const dateString = date.toString();

    // Filtrer les événements pour ce jour
    const dayEvents = events.filter((event) => {
      const match = event.date === dateString;
      if (match) {
        console.log("Association jour-événement:", {
          jour: i,
          date: dateString,
          événement: {
            titre: event.title,
            date: event.date,
            type: event.type,
          },
        });
      }
      return match;
    });

    const dayDate = new Date(currentYear, currentMonth - 1, i);
    monthDays.push({
      date: dateString,
      formattedDate: String(i),
      dayName: weekdays[dayDate.getDay()],
      events: dayEvents,
      isCurrentMonth: true,
    });
  }

  // Calculer les jours restants pour compléter la grille
  const remainingDays = 42 - monthDays.length; // 6 semaines * 7 jours = 42
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  for (let i = 1; i <= remainingDays; i++) {
    const date = new CustomDate(nextYear, nextMonth, i);
    const dateString = date.toString();

    // Filtrer les événements pour ce jour
    const dayEvents = events.filter((event) => {
      const match = event.date === dateString;
      if (match) {
        console.log("Événement trouvé pour jour suivant:", {
          date: dateString,
          event: event,
        });
      }
      return match;
    });

    const dayDate = new Date(nextYear, nextMonth - 1, i);
    monthDays.push({
      date: dateString,
      formattedDate: String(i),
      dayName: weekdays[dayDate.getDay()],
      events: dayEvents,
      isCurrentMonth: false,
    });
  }

  // Log des jours avec événements
  console.log(
    "Jours du mois avec événements:",
    monthDays
      .filter((day) => day.events.length > 0)
      .map((day) => ({
        date: day.date,
        jour: day.formattedDate,
        nombreEvents: day.events.length,
        événements: day.events.map((e) => ({
          titre: e.title,
          type: e.type,
        })),
      }))
  );

  return monthDays;
};

// Obtenir le nom du mois et l'année pour une date donnée en français
export const getCurrentMonthYear = (date: Date = new Date()) => {
  const customDate = CustomDate.fromDate(date);
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return `${months[customDate.month - 1]} ${customDate.year}`;
};

// Obtenir le mois suivant
export const getNextMonth = (date: Date): Date => {
  const customDate = CustomDate.fromDate(date);
  const nextMonth =
    customDate.month === 12
      ? new CustomDate(customDate.year + 1, 1, 1)
      : new CustomDate(customDate.year, customDate.month + 1, 1);
  return new Date(nextMonth.year, nextMonth.month - 1, nextMonth.day);
};

// Obtenir le mois précédent
export const getPreviousMonth = (date: Date): Date => {
  const customDate = CustomDate.fromDate(date);
  const prevMonth =
    customDate.month === 1
      ? new CustomDate(customDate.year - 1, 12, 1)
      : new CustomDate(customDate.year, customDate.month - 1, 1);
  return new Date(prevMonth.year, prevMonth.month - 1, prevMonth.day);
};

// Filtrer et trier les événements à venir
export const getUpcomingEvents = (events: Event[], limit = 5) => {
  const today = CustomDate.today();
  console.log("=== Filtrage des événements à venir ===");
  console.log("Date aujourd'hui:", today.toString());

  return events
    .filter((event) => {
      const eventDate = CustomDate.fromString(event.date);
      const isUpcoming = eventDate.isAfter(today) || eventDate.equals(today);
      console.log("Vérification événement:", {
        event: event.title,
        date: event.date,
        isUpcoming,
      });
      return isUpcoming;
    })
    .sort((a, b) => {
      const dateA = CustomDate.fromString(a.date);
      const dateB = CustomDate.fromString(b.date);
      if (dateA.equals(dateB)) return 0;
      return dateA.isBefore(dateB) ? -1 : 1;
    })
    .slice(0, limit);
};
