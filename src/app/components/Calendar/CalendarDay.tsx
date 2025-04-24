"use client";

import { ReactNode } from "react";
import { Event } from "./types";

// Fonction de validation des dates
const validateDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  console.log("Validation date:", {
    input: dateStr,
    parsed: { year, month, day },
    converted: new Date(year, month - 1, day).toLocaleDateString(),
  });
};

interface CalendarDayProps {
  date: string;
  formattedDate: string;
  dayName: string;
  events: Event[];
  isMobile: boolean;
  isCurrentMonth?: boolean;
  onSelectEvent: (event: Event) => void;
  getEventTypeClass: (type: Event["type"]) => string;
  getEventTypeIcon: (type: Event["type"]) => ReactNode;
}

export default function CalendarDay({
  date,
  formattedDate,
  dayName,
  events,
  isMobile,
  isCurrentMonth = true,
  onSelectEvent,
  getEventTypeClass,
  getEventTypeIcon,
}: CalendarDayProps) {
  // Validation de la date
  validateDate(date);

  // Log de debug pour chaque événement
  events.forEach((event) => {
    console.log("Timeline complète:", {
      input: `${formattedDate} ${dayName}`,
      dateStr: date,
      eventDate: event.date,
      match: event.date === date,
      renderedDay: formattedDate,
    });
  });

  // Fonction pour générer une clé unique pour les événements du jour
  const generateEventKey = (eventId: number) => {
    return `${date}-event-${eventId}`;
  };

  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 ${
        isMobile ? "min-h-[70px]" : "min-h-[100px]"
      } ${!isCurrentMonth ? "bg-gray-50 dark:bg-gray-900/50 opacity-60" : ""}`}
    >
      <div className="text-right mb-2">
        <span
          className={`text-sm font-medium ${
            !isCurrentMonth
              ? "text-gray-400 dark:text-gray-600"
              : dayName === "Sam" || dayName === "Dim"
              ? "text-red-500 dark:text-red-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {formattedDate}
        </span>
      </div>

      <div className="space-y-1">
        {events.slice(0, isMobile ? 1 : 3).map((event) => (
          <div
            key={generateEventKey(event.id)}
            className={`p-1 rounded text-xs cursor-pointer ${getEventTypeClass(
              event.type
            )}`}
            onClick={() => onSelectEvent(event)}
          >
            <div className="flex items-center">
              <span className="mr-1">{getEventTypeIcon(event.type)}</span>
              <span className="truncate">{event.title}</span>
            </div>
          </div>
        ))}
        {events.length > (isMobile ? 1 : 3) && (
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
            +{events.length - (isMobile ? 1 : 3)} plus
          </div>
        )}
      </div>
    </div>
  );
}
