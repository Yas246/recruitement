"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useIsMobile } from "../utils/responsive";

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "meeting" | "deadline" | "workshop" | "info";
  location?: string;
  link?: string;
  isImportant?: boolean;
}

interface EventDay {
  date: string;
  formattedDate: string;
  dayName: string;
  events: Event[];
  isCurrentMonth: boolean;
}

interface CalendarProps {
  events: Event[];
  title?: string;
}

export default function Calendar({
  events,
  title = "Calendrier",
}: CalendarProps) {
  const isMobile = useIsMobile();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventDays, setEventDays] = useState<EventDay[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mobileView, setMobileView] = useState<"calendar" | "upcoming">(
    "calendar"
  );

  // Format the current month label in French
  const currentMonthLabel = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  // Fonction pour obtenir le premier jour du mois (0 = Dimanche, 1 = Lundi, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convertir pour commencer par Lundi
  };

  // Fonction pour obtenir le nombre de jours dans le mois
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Fonction pour générer les jours du mois
  const generateDaysInMonth = useCallback(() => {
    const firstDay = getFirstDayOfMonth(currentMonth);
    const daysInMonth = getDaysInMonth(currentMonth);
    const days: EventDay[] = [];

    // Ajouter les jours du mois précédent si nécessaire
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthDays = getDaysInMonth(prevMonth);

    for (let i = 0; i < firstDay; i++) {
      const day = prevMonthDays - firstDay + i + 1;
      // Créer la date sans fuseau horaire
      const year = prevMonth.getFullYear();
      const month = prevMonth.getMonth() + 1;
      const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);

      days.push({
        date: formattedDate,
        formattedDate: day.toString(),
        dayName: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][
          date.getDay()
        ],
        events: [],
        isCurrentMonth: false,
      });
    }

    // Ajouter les jours du mois en cours
    for (let i = 1; i <= daysInMonth; i++) {
      // Créer la date sans fuseau horaire
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );

      days.push({
        date: formattedDate,
        formattedDate: i.toString(),
        dayName: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][
          date.getDay()
        ],
        events: [],
        isCurrentMonth: true,
      });
    }

    // Ajouter les jours du mois suivant si nécessaire
    const remainingDays = 42 - days.length; // 6 semaines complètes
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    for (let i = 1; i <= remainingDays; i++) {
      // Créer la date sans fuseau horaire
      const year = nextMonth.getFullYear();
      const month = nextMonth.getMonth() + 1;
      const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);

      days.push({
        date: formattedDate,
        formattedDate: i.toString(),
        dayName: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][
          date.getDay()
        ],
        events: [],
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  // Mettre à jour les jours et les événements quand le mois change
  useEffect(() => {
    const days = generateDaysInMonth();

    // Debug: Afficher les dates pour vérification
    console.log(
      "Dates du calendrier:",
      days.map((day) => day.date)
    );
    console.log(
      "Dates des événements:",
      events.map((event) => event.date)
    );

    const daysWithEvents = days.map((day) => ({
      ...day,
      events: events.filter((event) => {
        // Debug: Afficher la comparaison des dates
        console.log("Comparaison:", {
          dayDate: day.date,
          eventDate: event.date,
          match: event.date === day.date,
        });
        return event.date === day.date;
      }),
    }));
    setEventDays(daysWithEvents);
  }, [currentMonth, events, generateDaysInMonth]);

  // Navigation entre les mois
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Événements à venir pour l'affichage dans la barre latérale
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [events]);

  // Fonction pour obtenir la classe CSS en fonction du type d'événement
  const getEventTypeClass = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "deadline":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "workshop":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "info":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Fonction pour obtenir l'icône en fonction du type d'événement
  const getEventTypeIcon = (type: Event["type"]) => {
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
      default:
        return null;
    }
  };

  // Fonction pour générer une clé unique pour les événements du jour
  const generateEventKey = (day: string, eventId: number) => {
    return `${day}-event-${eventId}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {title}
      </h1>

      {isMobile && (
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setMobileView("calendar")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                mobileView === "calendar"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Calendrier
            </button>
            <button
              onClick={() => setMobileView("upcoming")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                mobileView === "upcoming"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              À venir
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendrier principal */}
        {(!isMobile || mobileView === "calendar") && (
          <div className="glass-card flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl ml-2 mt-2 font-semibold text-gray-900 dark:text-white">
                {currentMonthLabel}
              </h2>
              <div className="flex space-x-2 mr-2 mt-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Jours de la semaine */}
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                (day, index) => (
                  <div
                    key={`weekday-${index}`}
                    className="text-center font-medium text-gray-600 dark:text-gray-400 py-2"
                  >
                    {isMobile ? day.charAt(0) : day}
                  </div>
                )
              )}

              {/* Jours du mois */}
              {eventDays.map((day) => (
                <div
                  key={day.date}
                  className={`border border-gray-200 dark:border-gray-700 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 ${
                    isMobile ? "min-h-[70px]" : "min-h-[100px]"
                  } ${!day.isCurrentMonth ? "opacity-50" : ""}`}
                >
                  <div className="text-right mb-2">
                    <span
                      className={`text-sm font-medium ${
                        day.dayName === "Sam" || day.dayName === "Dim"
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {day.formattedDate}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {day.events.slice(0, isMobile ? 1 : 3).map((event) => (
                      <div
                        key={generateEventKey(day.date, event.id)}
                        className={`p-1 rounded text-xs cursor-pointer ${getEventTypeClass(
                          event.type
                        )}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center">
                          <span className="mr-1">
                            {getEventTypeIcon(event.type)}
                          </span>
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    ))}
                    {day.events.length > (isMobile ? 1 : 3) && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        +{day.events.length - (isMobile ? 1 : 3)} plus
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barre latérale avec événements à venir */}
        {(!isMobile || mobileView === "upcoming") && (
          <div className="md:w-1/3">
            <div className="glass-card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Événements à venir
              </h2>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={`upcoming-${event.id}`}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded ${getEventTypeClass(
                            event.type
                          )}`}
                        >
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                          <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>
                              {new Date(event.date).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                }
                              )}{" "}
                              à {event.time}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucun événement à venir
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal des détails d'événement */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Détails de l&apos;événement
              </h2>
              <button
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setSelectedEvent(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600 dark:text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium mb-4 ${getEventTypeClass(
                selectedEvent.type
              )}`}
            >
              {getEventTypeIcon(selectedEvent.type)}
              <span className="ml-1">
                {selectedEvent.type === "meeting"
                  ? "Rendez-vous"
                  : selectedEvent.type === "deadline"
                  ? "Date limite"
                  : selectedEvent.type === "workshop"
                  ? "Atelier"
                  : "Information"}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {selectedEvent.title}
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {selectedEvent.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {selectedEvent.date.split("-").reverse().join("/")} à{" "}
                  {selectedEvent.time}
                </span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.link && (
                <div className="pt-4">
                  <a
                    href={selectedEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Rejoindre
                  </a>
                </div>
              )}

              {selectedEvent.isImportant && (
                <div className="flex items-center text-amber-600 dark:text-amber-400 mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Événement important</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
