import { ReactNode } from "react";

export type EventType =
  | "meeting"
  | "deadline"
  | "workshop"
  | "info"
  | "admin_meeting";
export type EventStatus = "pending" | "confirmed" | "cancelled";

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // Format YYYY-MM-DD
  time: string;
  type: EventType;
  location?: string;
  link?: string;
  isImportant?: boolean;
  status?: EventStatus;
  meetingType?: string;
}

export interface EventDay {
  date: string; // Format YYYY-MM-DD
  formattedDate: string;
  dayName: string;
  events: Event[];
  isCurrentMonth?: boolean;
}

export interface CalendarProps {
  events: Event[];
  title?: string;
  currentMonth?: string;
}

export interface UpcomingEventProps {
  event: Event;
  onSelectEvent: (event: Event) => void;
  getEventTypeClass: (type: EventType) => string;
  getEventTypeIcon: (type: EventType) => ReactNode;
}

export interface EventModalProps {
  event: Event;
  onClose: () => void;
  getEventTypeClass: (type: EventType) => string;
  getEventTypeIcon: (type: EventType) => ReactNode;
}

// Réexporter Event comme export par défaut
export default Event;
