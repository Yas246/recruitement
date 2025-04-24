"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "../../utils/responsive";
import CalendarDay from "./CalendarDay";
import EventModal from "./EventModal";
import { CalendarProps, Event, EventDay, EventType } from "./types";
import UpcomingEvent from "./UpcomingEvent";
import {
  generateMonthDays,
  getCurrentMonthYear,
  getEventTypeClass,
  getEventTypeIcon,
  getNextMonth,
  getPreviousMonth,
  getUpcomingEvents,
} from "./utils";

export default function Calendar({
  events,
  title = "Calendrier",
}: CalendarProps) {
  const isMobile = useIsMobile();

  // État pour la date courante
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonthLabel, setCurrentMonthLabel] = useState(
    getCurrentMonthYear()
  );

  // Générer les jours du mois avec les événements associés
  const [eventDays, setEventDays] = useState<EventDay[]>([]);

  // État pour stocker les détails de l'événement sélectionné
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // État pour gérer l'affichage sur mobile (liste ou calendrier)
  const [mobileView, setMobileView] = useState<"calendar" | "upcoming">(
    "calendar"
  );

  // Événements à venir pour l'affichage dans la barre latérale
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  // Fonction pour naviguer au mois précédent
  const handlePreviousMonth = () => {
    const prevMonth = getPreviousMonth(currentDate);
    setCurrentDate(prevMonth);
    setCurrentMonthLabel(getCurrentMonthYear(prevMonth));
  };

  // Fonction pour naviguer au mois suivant
  const handleNextMonth = () => {
    const nextMonth = getNextMonth(currentDate);
    setCurrentDate(nextMonth);
    setCurrentMonthLabel(getCurrentMonthYear(nextMonth));
  };

  // Générer les jours du mois et les événements à venir lorsque les événements ou la date changent
  useEffect(() => {
    console.log("=== Événements reçus ===");
    console.log("Events bruts:", events);

    // Convertir les événements pour s'assurer que le type est correct
    const typedEvents = events.map((event) => {
      console.log("Traitement événement:", {
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        type: event.type,
      });
      return {
        ...event,
        type: event.type as EventType,
      };
    });

    console.log("=== Génération des jours du mois ===");
    console.log("Date courante:", currentDate);

    // Générer les jours du mois avec les événements
    const days = generateMonthDays(typedEvents, currentDate);
    console.log(
      "Jours générés:",
      days.filter((day) => day.events.length > 0)
    );
    setEventDays(days);

    // Obtenir les événements à venir
    const upcoming = getUpcomingEvents(typedEvents, 5);
    console.log("=== Événements à venir ===");
    console.log("Événements filtrés:", upcoming);
    setUpcomingEvents(upcoming);
  }, [events, currentDate]);

  // Log quand un événement est sélectionné
  useEffect(() => {
    if (selectedEvent) {
      console.log("=== Événement sélectionné ===");
      console.log("Event:", {
        id: selectedEvent.id,
        title: selectedEvent.title,
        date: selectedEvent.date,
        time: selectedEvent.time,
        type: selectedEvent.type,
      });
    }
  }, [selectedEvent]);

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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentMonthLabel}
              </h2>
              <div className="flex space-x-2">
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
                <CalendarDay
                  key={day.date}
                  date={day.date}
                  formattedDate={day.formattedDate}
                  dayName={day.dayName}
                  events={day.events}
                  isMobile={isMobile}
                  isCurrentMonth={day.isCurrentMonth}
                  onSelectEvent={setSelectedEvent}
                  getEventTypeClass={getEventTypeClass}
                  getEventTypeIcon={getEventTypeIcon}
                />
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
                  upcomingEvents.map((event, index) => (
                    <UpcomingEvent
                      key={`upcoming-${event.id || index}`}
                      event={event}
                      onSelectEvent={setSelectedEvent}
                      getEventTypeClass={getEventTypeClass}
                      getEventTypeIcon={getEventTypeIcon}
                    />
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
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          getEventTypeClass={getEventTypeClass}
          getEventTypeIcon={getEventTypeIcon}
        />
      )}
    </div>
  );
}

// Export the Event type for use in other components
export type { Event, EventType };
