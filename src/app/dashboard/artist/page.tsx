"use client";

import ProgressBar from "@/app/components/ProgressBar";
import Link from "next/link";

export default function ArtistDashboard() {
  // Données factices pour simuler les étapes de progression
  const progressSteps = [
    { id: 1, name: "Informations personnelles", completed: true },
    { id: 2, name: "Documents requis", completed: true },
    { id: 3, name: "Portfolio", completed: false, active: true },
    { id: 4, name: "Audition/Présentation", pending: true },
    { id: 5, name: "Décision finale", pending: true },
  ];

  // Données factices pour simuler les messages récents
  const recentMessages = [
    {
      id: 1,
      sender: "Directeur artistique OMSHINA",
      preview:
        "Votre portfolio a retenu notre attention. Nous aimerions organiser une présentation...",
      date: "Aujourd'hui, 15:45",
      unread: true,
    },
    {
      id: 2,
      sender: "Service des opportunités internationales",
      preview:
        "Nous vous invitons à participer au Festival International des Arts...",
      date: "Hier, 11:20",
      unread: true,
    },
    {
      id: 3,
      sender: "Support technique",
      preview:
        "Votre demande concernant le téléchargement des vidéos a été traitée...",
      date: "Lundi, 09:30",
      unread: false,
    },
  ];

  // Données factices pour les opportunités artistiques
  const artisticOpportunities = [
    {
      id: 1,
      title: "Résidence artistique à Berlin",
      organization: "Berlin Cultural Institute",
      location: "Berlin, Allemagne",
      duration: "3 mois",
      stipend: "1500€/mois",
      deadline: "15 juillet 2023",
      match: 95,
    },
    {
      id: 2,
      title: "Exposition collective 'Nouveaux Talents'",
      organization: "Galerie d'Art Contemporain",
      location: "Paris, France",
      duration: "2 semaines",
      deadline: "30 juin 2023",
      match: 88,
    },
    {
      id: 3,
      title: "Programme d'échange artistique",
      organization: "Tokyo Arts Foundation",
      location: "Tokyo, Japon",
      duration: "6 mois",
      stipend: "2000€/mois + logement",
      deadline: "1 août 2023",
      match: 82,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progression */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Progression de votre dossier
          </h2>

          <ProgressBar steps={progressSteps} />

          <div className="mt-8">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Votre dossier avance bien! Pour continuer, il est important de
              finaliser votre portfolio en ligne.
            </p>

            <Link
              href="/dashboard/artist/portfolio"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-full inline-flex items-center transition-colors"
            >
              Gérer mon portfolio
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Messages récents */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Messages récents
          </h2>

          <div className="space-y-4">
            {recentMessages.map((message) => (
              <Link
                href="/dashboard/artist/messages"
                key={message.id}
                className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-100 dark:border-gray-800"
              >
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    {message.sender}
                    {message.unread && (
                      <span className="ml-2 w-2 h-2 rounded-full bg-primary-500"></span>
                    )}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {message.date}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                  {message.preview}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/dashboard/artist/messages"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm"
            >
              Voir tous les messages
            </Link>
          </div>
        </div>

        {/* Opportunités artistiques */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Opportunités artistiques recommandées
          </h2>

          <div className="space-y-4">
            {artisticOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {opportunity.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Match {opportunity.match}%
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                  {opportunity.organization} • {opportunity.location}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {opportunity.duration && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
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
                      {opportunity.duration}
                    </span>
                  )}
                  {opportunity.stipend && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {opportunity.stipend}
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
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
                    Date limite: {opportunity.deadline}
                  </span>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="#"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Voir toutes les opportunités
            </Link>
          </div>
        </div>

        {/* Compétences et informations */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Mon profil artistique
          </h2>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Disciplines
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                Peinture
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                Arts numériques
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                Photographie
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                Installation
              </span>
            </div>

            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Réseaux sociaux
            </h3>
            <div className="space-y-2 mb-6">
              <a
                href="#"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
              <a
                href="#"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                Facebook
              </a>
              <a
                href="#"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </a>
              <a
                href="#"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,14.598V9.402c0-0.385,0.417-0.625,0.75-0.433l4.5,2.598c0.333,0.192,0.333,0.674,0,0.866l-4.5,2.598 C10.417,15.224,10,14.983,10,14.598z" />
                </svg>
                YouTube
              </a>
            </div>

            <div className="mt-6">
              <Link
                href="/dashboard/artist/profile"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center"
              >
                Modifier mon profil
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
