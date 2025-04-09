"use client";

import ProgressBar from "@/app/components/ProgressBar";
import Link from "next/link";

export default function OtherDashboard() {
  // Données factices pour simuler les étapes de progression
  const progressSteps = [
    {
      id: 1,
      name: "Informations personnelles",
      completed: true,
    },
    {
      id: 2,
      name: "Documents requis",
      completed: false,
      active: true,
    },
    {
      id: 3,
      name: "Candidature",
      pending: false,
    },
    {
      id: 4,
      name: "Entretien",
      pending: false,
    },
    {
      id: 5,
      name: "Décision finale",
      pending: false,
    },
  ];

  // Données factices pour les actualités/opportunités
  const opportunities = [
    {
      id: 1,
      title: "Opportunités internationales",
      description:
        "Découvrez les dernières opportunités disponibles pour votre profil dans notre réseau international.",
      date: "15 Juin 2023",
      link: "#",
      important: true,
    },
    {
      id: 2,
      title: "Webinaire d'information",
      description:
        "Participez à notre prochain webinaire pour en savoir plus sur les démarches et les possibilités qui s'offrent à vous.",
      date: "25 Juin 2023",
      link: "#",
      important: false,
    },
    {
      id: 3,
      title: "Mise à jour des documents",
      description:
        "N'oubliez pas de soumettre tous vos documents avant la date limite pour que nous puissions traiter votre dossier.",
      date: "10 Juil 2023",
      link: "#",
      important: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Bienvenue sur votre espace personnel
      </h1>

      {/* Progress Bar */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Suivi de votre dossier
        </h2>
        <ProgressBar steps={progressSteps} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Prochaines étapes
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Compléter votre profil
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Assurez-vous que toutes vos informations personnelles sont à
                    jour.
                  </p>
                  <div className="mt-2">
                    <Link
                      href="/dashboard/other/application"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Modifier mon profil &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Soumettre vos documents
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Téléversez tous les documents requis pour compléter votre
                    dossier.
                  </p>
                  <div className="mt-2">
                    <Link
                      href="/dashboard/other/documents"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Gérer mes documents &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Contacter un conseiller
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Notre équipe est disponible pour répondre à vos questions.
                  </p>
                  <div className="mt-2">
                    <Link
                      href="/dashboard/other/messages"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Envoyer un message &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Opportunités et actualités
            </h2>
            <div className="space-y-6">
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className={`p-4 rounded-lg ${
                    opportunity.important
                      ? "bg-primary-50 border border-primary-200 dark:bg-primary-900/10 dark:border-primary-900/30"
                      : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start">
                    {opportunity.important && (
                      <div className="mr-3 text-primary-600 dark:text-primary-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {opportunity.date}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {opportunity.description}
                      </p>
                      <div className="mt-3">
                        <a
                          href={opportunity.link}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          En savoir plus &rarr;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Mon profil
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Objectifs
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Vous avez indiqué que votre principal objectif est de vous
                  orienter vers des opportunités adaptées à votre profil
                  spécifique.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Situation actuelle
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Vous êtes actuellement en recherche d&apos;opportunités
                  internationales.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/dashboard/other/application"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Modifier mon profil
                </Link>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Ressources utiles
            </h2>

            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Guide des opportunités internationales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Conseils pour réussir votre projet
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Informations sur les démarches administratives
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Guide pour préparer votre expatriation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
