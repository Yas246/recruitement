"use client";

import { ReactNode } from "react";
import { Event } from "./types";

interface UpcomingEventProps {
  event: Event;
  onSelectEvent: (event: Event) => void;
  getEventTypeClass: (type: Event["type"]) => string;
  getEventTypeIcon: (type: Event["type"]) => ReactNode;
}

export default function UpcomingEvent({
  event,
  onSelectEvent,
  getEventTypeClass,
  getEventTypeIcon,
}: UpcomingEventProps) {
  return (
    <div
      key={`upcoming-${event.id}`}
      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
      onClick={() => onSelectEvent(event)}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded ${getEventTypeClass(event.type)}`}>
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
              {event.date.split("-").reverse().slice(0, 2).join("/")} à{" "}
              {event.time}
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
  );
}
