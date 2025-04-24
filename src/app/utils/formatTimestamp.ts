import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";

export function formatTimestamp(timestamp: string | Timestamp | Date): string {
  let date: Date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    console.error("Date invalide:", timestamp);
    return "Date invalide";
  }

  if (isToday(date)) {
    return format(date, "HH:mm");
  }

  if (isYesterday(date)) {
    return "Hier";
  }

  if (isThisWeek(date)) {
    return format(date, "EEEE", { locale: fr });
  }

  return format(date, "dd/MM/yyyy");
}
