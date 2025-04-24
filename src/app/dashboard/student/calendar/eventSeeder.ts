import { Event } from "@/app/components/Calendar/types";
import { FirestoreDocument, firestoreService } from "@/firebase";

// Type pour les événements sans ID
type EventWithoutId = Omit<Event, "id">;

// Type pour les événements dans Firestore
interface CalendarEvent extends FirestoreDocument, EventWithoutId {
  studentId: string;
  eventId: number;
}

/**
 * Génère des événements de test pour un étudiant dans Firestore
 * @param userId ID de l'étudiant
 * @returns Promise<boolean> Vrai si les événements ont été créés avec succès
 */
export const seedEvents = async (userId: string): Promise<boolean> => {
  if (!userId) {
    console.error(
      "L'ID de l'utilisateur est requis pour créer des événements de test"
    );
    return false;
  }

  try {
    // Collection d'événements pour l'étudiant
    const eventsCollection = `students/${userId}/events`;

    // Vérifier s'il y a déjà des événements
    const existingEvents =
      await firestoreService.getAllDocuments<CalendarEvent>(eventsCollection);

    if (existingEvents && existingEvents.length > 0) {
      console.log(
        `${existingEvents.length} événements existent déjà pour cet étudiant`
      );
      // Supprimer les événements existants pour éviter les doublons
      for (const event of existingEvents) {
        if (event.id) {
          await firestoreService.deleteDocument(eventsCollection, event.id);
        }
      }
    }

    // Date actuelle
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();

    console.log(
      `Génération d'événements pour le mois actuel: ${
        currentMonth + 1
      }/${currentYear}`
    );

    // Générer des événements pour le mois actuel
    const events: CalendarEvent[] = [];

    // 1. Rendez-vous d'orientation - dans quelques jours (dans le mois actuel)
    const orientationDate = new Date(
      currentYear,
      currentMonth,
      Math.min(currentDay + 2, 28)
    );
    const orientationDateStr = formatDate(orientationDate);
    console.log(`Date 1 (orientation): ${orientationDateStr}`);

    events.push({
      studentId: userId,
      eventId: 1,
      title: "Rendez-vous d'orientation",
      description:
        "Discussion avec le conseiller pédagogique pour orienter votre parcours académique.",
      date: orientationDateStr,
      time: "14:30",
      type: "meeting",
      location: "Bureau B103, Campus Principal",
      link: "https://meet.google.com/abc-defg-hij",
      isImportant: true,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Date limite pour le dossier d'inscription - une semaine plus tard (dans le mois actuel)
    const deadlineDate = new Date(
      currentYear,
      currentMonth,
      Math.min(currentDay + 7, 28)
    );
    const deadlineDateStr = formatDate(deadlineDate);
    console.log(`Date 2 (deadline): ${deadlineDateStr}`);

    events.push({
      studentId: userId,
      eventId: 2,
      title: "Date limite - Dossier d'inscription",
      description:
        "Dernier jour pour soumettre votre dossier d'inscription complet (certificats, diplômes, etc.)",
      date: deadlineDateStr,
      time: "18:00",
      type: "deadline",
      isImportant: true,
      createdAt: now,
      updatedAt: now,
    });

    // 3. Atelier CV et lettre de motivation - dans deux semaines (dans le mois actuel)
    const workshopDate = new Date(
      currentYear,
      currentMonth,
      Math.min(currentDay + 14, 28)
    );
    const workshopDateStr = formatDate(workshopDate);
    console.log(`Date 3 (workshop): ${workshopDateStr}`);

    events.push({
      studentId: userId,
      eventId: 3,
      title: "Atelier CV et lettre de motivation",
      description:
        "Participez à notre atelier pour améliorer votre CV et rédiger une lettre de motivation efficace.",
      date: workshopDateStr,
      time: "10:00",
      type: "workshop",
      location: "Salle de conférence A, Campus Principal",
      link: "https://meet.google.com/xyz-abcd-efg",
      createdAt: now,
      updatedAt: now,
    });

    // 4. Information - Réunion d'information - plus tard dans le mois actuel
    const infoDate = new Date(
      currentYear,
      currentMonth,
      Math.min(currentDay + 18, 28)
    );
    const infoDateStr = formatDate(infoDate);
    console.log(`Date 4 (info): ${infoDateStr}`);

    events.push({
      studentId: userId,
      eventId: 4,
      title: "Réunion d'information - Programme international",
      description:
        "Présentation des opportunités d'échanges internationaux et des bourses disponibles.",
      date: infoDateStr,
      time: "15:00",
      type: "info",
      location: "Auditorium, Campus Principal",
      createdAt: now,
      updatedAt: now,
    });

    // 5. Rendez-vous entretien d'embauche simulé - vers la fin du mois
    const interviewDate = new Date(
      currentYear,
      currentMonth,
      Math.min(currentDay + 21, 28)
    );
    const interviewDateStr = formatDate(interviewDate);
    console.log(`Date 5 (interview): ${interviewDateStr}`);

    events.push({
      studentId: userId,
      eventId: 5,
      title: "Entretien d'embauche simulé",
      description:
        "Session de pratique pour les entretiens d'embauche avec des recruteurs professionnels.",
      date: interviewDateStr,
      time: "11:30",
      type: "meeting",
      location: "Salle B205, Campus Principal",
      createdAt: now,
      updatedAt: now,
    });

    // 6. Date limite pour les choix de cours - fin du mois
    const courseDeadlineDate = new Date(
      currentYear,
      currentMonth,
      Math.min(currentDay + 25, 28)
    );
    const courseDeadlineDateStr = formatDate(courseDeadlineDate);
    console.log(`Date 6 (course deadline): ${courseDeadlineDateStr}`);

    events.push({
      studentId: userId,
      eventId: 6,
      title: "Date limite - Choix de cours",
      description:
        "Dernier jour pour sélectionner vos cours pour le prochain semestre.",
      date: courseDeadlineDateStr,
      time: "23:59",
      type: "deadline",
      isImportant: true,
      createdAt: now,
      updatedAt: now,
    });

    // 7. Information - Journée portes ouvertes - pour le mois prochain (mais proche)
    const openDayDate = new Date(
      currentYear,
      currentMonth,
      Math.min(currentDay + 30, 28)
    );
    const openDayDateStr = formatDate(openDayDate);
    console.log(`Date 7 (open day): ${openDayDateStr}`);

    events.push({
      studentId: userId,
      eventId: 7,
      title: "Journée portes ouvertes",
      description:
        "Venez avec vos amis et votre famille pour découvrir notre campus et nos programmes.",
      date: openDayDateStr,
      time: "09:00",
      type: "info",
      location: "Hall principal, Campus Principal",
      createdAt: now,
      updatedAt: now,
    });

    // Enregistrer les événements dans Firestore
    for (const event of events) {
      await firestoreService.addDocument(eventsCollection, event);
    }

    console.log(
      `${events.length} événements de test créés avec succès pour l'étudiant ${userId}`
    );
    return true;
  } catch (error) {
    console.error("Erreur lors de la création des événements de test:", error);
    return false;
  }
};

/**
 * Formate une date au format YYYY-MM-DD
 * @param date Date à formater
 * @returns String au format YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
