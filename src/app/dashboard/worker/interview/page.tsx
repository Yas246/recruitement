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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Mes Entretiens
      </h1>

      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Progression de votre dossier
        </h2>
        <ProgressBar steps={progressSteps} />
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Félicitations ! Vous avez été sélectionné pour des entretiens.
          Préparez-vous bien et consultez les détails ci-dessous.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des entretiens */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Entretiens planifiés
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Consultez vos entretiens à venir et passés. Cliquez sur un
                entretien pour voir les détails.
              </p>
            </div>

            <div className="space-y-4">
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
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer ${
                      selectedInterview?.id === interview.id
                        ? "ring-2 ring-primary-500"
                        : ""
                    }`}
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <div className="flex items-center">
                      {interviewTypeIcons[interview.type]}
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {interview.position} - {interview.company}
                        </h3>
                        <div className="flex items-center mt-1 space-x-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {interview.date} • {interview.time}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              interview.status === "scheduled"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : interview.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {interview.status === "scheduled"
                              ? "Planifié"
                              : interview.status === "completed"
                              ? "Terminé"
                              : interview.status === "cancelled"
                              ? "Annulé"
                              : "En attente"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Détails de l'entretien */}
        <div className="glass-card p-6">
          {selectedInterview ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Détails de l&apos;entretien
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedInterview.position}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedInterview.company}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedInterview.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Heure
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedInterview.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Type
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center">
                      {selectedInterview.type === "onsite"
                        ? "Sur site"
                        : selectedInterview.type === "video"
                        ? "Vidéoconférence"
                        : "Appel téléphonique"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Statut
                    </p>
                    <p
                      className={`font-medium ${
                        selectedInterview.status === "scheduled"
                          ? "text-blue-600 dark:text-blue-400"
                          : selectedInterview.status === "completed"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {selectedInterview.status === "scheduled"
                        ? "Planifié"
                        : selectedInterview.status === "completed"
                        ? "Terminé"
                        : selectedInterview.status === "cancelled"
                        ? "Annulé"
                        : "En attente"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Lieu
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedInterview.location}
                  </p>
                </div>

                {selectedInterview.interviewers && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Interviewers
                    </p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {selectedInterview.interviewers.map((interviewer, i) => (
                        <li
                          key={i}
                          className="font-medium text-gray-900 dark:text-white"
                        >
                          {interviewer}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedInterview.preparationMaterials && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Matériel de préparation
                    </p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {selectedInterview.preparationMaterials.map(
                        (material, i) => (
                          <li
                            key={i}
                            className="font-medium text-gray-900 dark:text-white"
                          >
                            {material}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Notes d'entretien */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Notes
                  </p>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Ajoutez vos notes concernant cet entretien..."
                    value={selectedInterview.notes || ""}
                    onChange={(e) =>
                      addNote(selectedInterview.id, e.target.value)
                    }
                  />
                </div>

                <div className="flex space-x-3">
                  {selectedInterview.status === "scheduled" && (
                    <button
                      onClick={() => markAsCompleted(selectedInterview.id)}
                      className="flex-1 btn-primary py-2"
                    >
                      Marquer comme terminé
                    </button>
                  )}
                  <button
                    className="flex-1 btn-secondary py-2"
                    onClick={() => {
                      // Ajouter au calendrier (fonctionnalité simulée)
                      alert(
                        "Cette fonctionnalité ajouterait l'entretien à votre calendrier."
                      );
                    }}
                  >
                    Ajouter au calendrier
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                Aucun entretien sélectionné
              </h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Sélectionnez un entretien dans la liste pour voir ses détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
