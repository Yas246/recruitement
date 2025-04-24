"use client";

import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { Event } from "./types";

interface EventModalProps {
  event: Event;
  onClose: () => void;
  getEventTypeClass: (type: Event["type"]) => string;
  getEventTypeIcon: (type: Event["type"]) => ReactNode;
}

export default function EventModal({
  event,
  onClose,
  getEventTypeClass,
  getEventTypeIcon,
}: EventModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Détails de l&apos;événement
          </h2>
          <button
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={onClose}
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
            event.type
          )}`}
        >
          {getEventTypeIcon(event.type)}
          <span className="ml-1">
            {event.type === "meeting"
              ? "Rendez-vous"
              : event.type === "deadline"
              ? "Date limite"
              : event.type === "workshop"
              ? "Atelier"
              : event.type === "admin_meeting"
              ? "Réunion administrative"
              : "Information"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {event.title}
        </h3>

        {event.type === "admin_meeting" && (
          <div className="mt-4">
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${
                event.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : ""
              }
              ${
                event.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : ""
              }
              ${event.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
            `}
            >
              {event.status === "confirmed" && "Confirmée"}
              {event.status === "pending" && "En attente"}
              {event.status === "cancelled" && "Annulée"}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <BuildingOfficeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              <p>Type de réunion : {event.meetingType || "Non spécifié"}</p>
            </div>
          </div>
        )}

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {event.description}
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
              {event.date.split("-").reverse().join("/")} à {event.time}
            </span>
          </div>

          {event.location && (
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
              <span>{event.location}</span>
            </div>
          )}

          {event.link && (
            <div className="pt-4">
              <a
                href={event.link}
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

          {event.isImportant && (
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
  );
}
