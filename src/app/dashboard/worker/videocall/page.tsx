"use client";

import VideoCall from "@/app/components/VideoCall";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { firestoreService, FirestoreDocument } from "@/firebase";
import { Timestamp, where } from "firebase/firestore";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";

// Interface pour les réunions vidéo
interface VideoMeeting extends FirestoreDocument {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  participants: string[];
  participantDetails: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  status: "scheduled" | "completed" | "cancelled";
  roomId: string;
  createdAt: Timestamp;
  createdBy: string;
}

export default function WorkerVideoCall() {
  const toast = useToast();
  const toastRef = useRef(toast);
  const { user, userData } = useAuth();
  const [activeMeeting, setActiveMeeting] = useState<VideoMeeting | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<VideoMeeting[]>([]);
  const [pastMeetings, setPastMeetings] = useState<VideoMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchMeetings = async () => {
      setIsLoading(true);

      try {
        // Récupérer toutes les réunions où l'utilisateur est dans la liste des participants
        const meetingsCollection =
          await firestoreService.queryDocuments<VideoMeeting>("videoMeetings", [
            where("participants", "array-contains", user.uid),
          ]);

        if (meetingsCollection) {
          const now = DateTime.now();

          // Filtrer les réunions à venir et passées
          const upcoming = meetingsCollection
            .filter((meeting) => {
              const meetingDate = DateTime.fromISO(
                `${meeting.date}T${meeting.time}`
              );
              return (
                meeting.status !== "cancelled" &&
                meeting.status !== "completed" &&
                meetingDate > now
              );
            })
            .sort((a, b) => {
              const dateA = DateTime.fromISO(`${a.date}T${a.time}`);
              const dateB = DateTime.fromISO(`${b.date}T${b.time}`);
              return dateA.toMillis() - dateB.toMillis();
            });

          const past = meetingsCollection
            .filter((meeting) => {
              const meetingDate = DateTime.fromISO(
                `${meeting.date}T${meeting.time}`
              );
              return (
                meeting.status === "cancelled" ||
                meeting.status === "completed" ||
                meetingDate <= now
              );
            })
            .sort((a, b) => {
              const dateA = DateTime.fromISO(`${a.date}T${a.time}`);
              const dateB = DateTime.fromISO(`${b.date}T${b.time}`);
              return dateB.toMillis() - dateA.toMillis();
            });

          setUpcomingMeetings(upcoming);
          setPastMeetings(past);

          // Définir la première réunion à venir comme active par défaut
          if (upcoming.length > 0) {
            setActiveMeeting(upcoming[0]);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des réunions:", error);
        toastRef.current.error("Impossible de récupérer vos entretiens vidéo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [user?.uid]);

  // Formatter la date pour l'affichage
  const formatDate = (dateString: string, timeString: string) => {
    const dt = DateTime.fromISO(`${dateString}T${timeString}`);
    return dt.toFormat("dd MMMM yyyy à HH:mm", { locale: "fr" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  if (
    !activeMeeting &&
    upcomingMeetings.length === 0 &&
    pastMeetings.length === 0
  ) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mon entretien
          </h1>
        </div>

        <div className="glass-card p-6 rounded-xl text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun entretien programmé
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Vous n&apos;avez actuellement aucun entretien programmé.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Contactez l&apos;administration pour plus d&apos;informations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mes entretiens
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {upcomingMeetings.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {activeMeeting?.title || upcomingMeetings[0].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Entretien avec l&apos;administration
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatDate(
                    activeMeeting?.date || upcomingMeetings[0].date,
                    activeMeeting?.time || upcomingMeetings[0].time
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="glass-card p-4 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Format
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Entretien individuel
                </p>
              </div>

              <div className="glass-card p-4 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 dark:text-green-400 mb-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Documents
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  CV à jour
                </p>
              </div>

              <div className="glass-card p-4 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600 dark:text-amber-400 mb-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Durée prévue
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  30 minutes environ
                </p>
              </div>
            </div>

            <div className="glass-card p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Préparation à l&apos;entretien
              </h3>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li>
                  Préparez-vous à parler de votre expérience et de vos
                  compétences professionnelles
                </li>
                <li>
                  Révisez les projets sur lesquels vous avez travaillé récemment
                </li>
                <li>
                  Renseignez-vous sur les nouvelles orientations de
                  l&apos;université
                </li>
                <li>
                  Préparez des exemples concrets de vos réalisations
                  professionnelles
                </li>
                <li>
                  Assurez-vous d&apos;être dans un environnement calme et bien
                  éclairé pour la visioconférence
                </li>
              </ul>
            </div>

            {upcomingMeetings.length > 1 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Autres entretiens programmés
                </h3>
                <div className="space-y-3">
                  {upcomingMeetings
                    .filter(
                      (meeting) =>
                        meeting.id !==
                        (activeMeeting?.id || upcomingMeetings[0].id)
                    )
                    .map((meeting) => (
                      <div
                        key={meeting.id}
                        className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/60 cursor-pointer"
                        onClick={() => setActiveMeeting(meeting)}
                      >
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {meeting.title}
                          </p>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(meeting.date, meeting.time)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Composant VideoCall */}
        {activeMeeting && (
          <VideoCall
            roomName={activeMeeting.roomId}
            userType="worker"
            userName={userData?.displayName || "Travailleur"}
          />
        )}

        {/* Entretiens passés */}
        {pastMeetings.length > 0 && (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Historique des entretiens
            </h3>
            <div className="space-y-3">
              {pastMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {meeting.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(meeting.date, meeting.time)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        meeting.status === "completed"
                          ? "py-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "py-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {meeting.status === "completed" ? "Terminé" : "Annulé"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
