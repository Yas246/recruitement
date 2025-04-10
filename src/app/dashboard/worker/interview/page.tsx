"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useState } from "react";

// Types pour les entretiens
interface Interview {
  id: string;
  company: string;
  position: string;
  date: string;
  time: string;
  location: string;
  type: "onsite" | "video" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "pending";
  notes?: string;
  interviewers?: string[];
  preparationMaterials?: string[];
}

export default function WorkerInterview() {
  // Données factices pour simuler les étapes de progression
  const progressSteps = [
    { id: 1, name: "Informations personnelles", completed: true },
    { id: 2, name: "Documents requis", completed: true },
    { id: 3, name: "Candidature", completed: true },
    { id: 4, name: "Entretien", completed: false, active: true },
    { id: 5, name: "Décision finale", pending: true },
  ];

  // Entretiens simulés
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: "int1",
      company: "Innovatech Solutions",
      position: "Développeur Full Stack",
      date: "23/05/2023",
      time: "14:00 - 15:30",
      location: "En ligne (Microsoft Teams)",
      type: "video",
      status: "scheduled",
      interviewers: ["Marie Dupont (RH)", "Jean Martin (CTO)"],
      preparationMaterials: [
        "Portfolio de projets",
        "Cas d'étude technique",
        "Questions techniques courantes",
      ],
    },
    {
      id: "int2",
      company: "Digital Forward",
      position: "Ingénieur Frontend",
      date: "15/05/2023",
      time: "10:00 - 11:00",
      location: "Appel téléphonique",
      type: "phone",
      status: "completed",
      notes:
        "Entretien initial avec le recruteur. Questions générales sur l'expérience et les compétences. Bonne impression générale.",
    },
    {
      id: "int3",
      company: "TechGrowth SA",
      position: "Développeur React Senior",
      date: "30/05/2023",
      time: "09:30 - 12:00",
      location: "25 Avenue des Champs-Élysées, Paris",
      type: "onsite",
      status: "scheduled",
      interviewers: [
        "Sophie Bernard (Responsable d'équipe)",
        "Philippe Lefèvre (Architecte technique)",
        "Emma Petit (Développeuse Senior)",
      ],
      preparationMaterials: [
        "Documentation sur l'architecture React",
        "Stratégies de gestion d'état",
        "Optimisation des performances",
      ],
    },
  ]);

  // État pour l'entretien sélectionné
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );

  // Fonction pour ajouter une note à un entretien
  const addNote = (interviewId: string, note: string) => {
    setInterviews((prevInterviews) =>
      prevInterviews.map((interview) =>
        interview.id === interviewId ? { ...interview, notes: note } : interview
      )
    );
  };

  // Fonction pour marquer un entretien comme terminé
  const markAsCompleted = (interviewId: string) => {
    setInterviews((prevInterviews) =>
      prevInterviews.map((interview) =>
        interview.id === interviewId
          ? { ...interview, status: "completed" }
          : interview
      )
    );
  };

  // Icônes pour les différents types d'entretiens
  const interviewTypeIcons = {
    onsite: (
      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    video: (
      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      </div>
    ),
    phone: (
      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      </div>
    ),
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">
        Mes Entretiens
      </h1>

      <div className="glass-card p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
          Progression de votre dossier
        </h2>
        <ProgressBar steps={progressSteps} />
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
          Félicitations ! Vous avez été sélectionné pour des entretiens.
          Préparez-vous bien et consultez les détails ci-dessous.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Liste des entretiens */}
        <div className="lg:col-span-2">
          <div className="glass-card p-4 sm:p-6">
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Entretiens planifiés
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Consultez vos entretiens à venir et passés. Cliquez sur un
                entretien pour voir les détails.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {interviews
                .sort((a, b) => {
                  // Trier par date (les plus récents en premier)
                  const dateA = new Date(a.date.split("/").reverse().join("-"));
                  const dateB = new Date(b.date.split("/").reverse().join("-"));
                  return dateA.getTime() - dateB.getTime();
                })
                .map((interview) => (
                  <div
                    key={interview.id}
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer ${
                      selectedInterview?.id === interview.id
                        ? "ring-2 ring-primary-500"
                        : ""
                    }`}
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <div className="flex items-start mb-2 sm:mb-0">
                      <div className="mr-3 sm:mr-4 mt-1">
                        {interviewTypeIcons[interview.type]}
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                          <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                            {interview.position}
                          </h3>
                          <span className="text-xs text-gray-600 dark:text-gray-400 sm:ml-2">
                            {interview.company}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="text-gray-600 dark:text-gray-400 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {interview.date}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {interview.time}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {interview.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      {interview.status === "completed" ? (
                        <span className="inline-block w-full sm:w-auto text-center px-2.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400">
                          Terminé
                        </span>
                      ) : interview.status === "scheduled" ? (
                        <span className="inline-block w-full sm:w-auto text-center px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                          Planifié
                        </span>
                      ) : (
                        <span className="inline-block w-full sm:w-auto text-center px-2.5 py-0.5 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/30 dark:text-red-400">
                          Annulé
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Détails de l'entretien */}
        <div className="glass-card p-4 sm:p-6">
          {selectedInterview ? (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Détails de l&apos;entretien
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                    {selectedInterview.position}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {selectedInterview.company}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {selectedInterview.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Heure
                    </p>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {selectedInterview.time}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Lieu
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">
                    {selectedInterview.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Type d&apos;entretien
                  </p>
                  <p className="font-medium text-sm text-gray-900 dark:text-white flex items-center">
                    <span className="mr-2">
                      {selectedInterview.type === "onsite"
                        ? "En personne"
                        : selectedInterview.type === "video"
                        ? "Visioconférence"
                        : "Téléphonique"}
                    </span>
                    <span className="inline-block w-5 h-5">
                      {interviewTypeIcons[selectedInterview.type]}
                    </span>
                  </p>
                </div>

                {selectedInterview.interviewers &&
                  selectedInterview.interviewers.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Interlocuteurs
                      </p>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-gray-900 dark:text-white ml-1">
                        {selectedInterview.interviewers.map(
                          (interviewer, index) => (
                            <li key={index}>{interviewer}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {selectedInterview.preparationMaterials &&
                  selectedInterview.preparationMaterials.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Matériel de préparation
                      </p>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-gray-900 dark:text-white ml-1">
                        {selectedInterview.preparationMaterials.map(
                          (material, index) => (
                            <li key={index}>{material}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {selectedInterview.notes && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Notes
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                      {selectedInterview.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                {selectedInterview.status === "scheduled" && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Ajouter des notes
                      </p>
                      <textarea
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white h-20"
                        placeholder="Notez vos questions, observations..."
                        value={selectedInterview.notes || ""}
                        onChange={(e) =>
                          addNote(selectedInterview.id, e.target.value)
                        }
                      ></textarea>
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                      <a
                        href={
                          selectedInterview.type === "video"
                            ? `/dashboard/worker/videocall?id=${selectedInterview.id}`
                            : "#"
                        }
                        className={`text-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                          selectedInterview.type === "video"
                            ? "bg-primary-600 hover:bg-primary-700 text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800"
                        }`}
                      >
                        Rejoindre la réunion
                      </a>
                      <button
                        onClick={() => markAsCompleted(selectedInterview.id)}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Marquer comme terminé
                      </button>
                    </div>
                  </>
                )}

                {selectedInterview.status === "completed" && (
                  <div className="flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-lg p-3 sm:p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300">
                      Entretien terminé
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 md:py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              <h3 className="mt-2 text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white">
                Sélectionnez un entretien
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Cliquez sur un entretien pour voir ses détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
