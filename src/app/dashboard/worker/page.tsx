"use client";

import ProgressBar from "@/app/components/ProgressBar";
import Link from "next/link";

export default function WorkerDashboard() {
  // Données factices pour simuler les étapes de progression
  const progressSteps = [
    { id: 1, name: "Informations personnelles", completed: true },
    { id: 2, name: "Documents requis", completed: true },
    { id: 3, name: "Candidature", completed: false, active: true },
    { id: 4, name: "Entretien", pending: true },
    { id: 5, name: "Décision finale", pending: true },
  ];

  // Données factices pour simuler les messages récents
  const recentMessages = [
    {
      id: 1,
      sender: "Recruteur OMSHINA",
      preview: "Votre profil a retenu notre attention. Pouvons-nous...",
      date: "Aujourd'hui, 10:15",
      unread: true,
    },
    {
      id: 2,
      sender: "Support administratif",
      preview: "Vos documents ont bien été reçus...",
      date: "Hier, 14:30",
      unread: false,
    },
  ];

  // Données factices pour les opportunités d'emploi
  const jobOpportunities = [
    {
      id: 1,
      title: "Ingénieur Développeur Full-Stack",
      company: "Tech Solutions Inc.",
      location: "Paris, France",
      salary: "50K-65K €",
      match: 92,
    },
    {
      id: 2,
      title: "Chef de Projet IT",
      company: "Global Innovations",
      location: "Lyon, France",
      salary: "60K-75K €",
      match: 85,
    },
    {
      id: 3,
      title: "Analyste de Données",
      company: "DataMetrics",
      location: "Bordeaux, France",
      salary: "45K-55K €",
      match: 78,
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
              Votre progression est en bonne voie. Pour continuer, veuillez
              compléter votre dossier de candidature.
            </p>

            <Link
              href="/dashboard/worker/application"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-full inline-flex items-center transition-colors"
            >
              Compléter ma candidature
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Messages récents
            </h2>

            <Link
              href="/dashboard/worker/messages"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              Voir tous
            </Link>
          </div>

          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {message.sender}
                      {message.unread && (
                        <span className="ml-2 inline-block w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {message.preview}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunités d'emploi */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Opportunités d&apos;emploi recommandées
            </h2>
            <Link
              href="/dashboard/worker/jobs"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              Voir toutes
            </Link>
          </div>

          <div className="space-y-4">
            {jobOpportunities.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {job.company} • {job.location}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                      Salaire: {job.salary}
                    </p>
                  </div>
                  <div className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {job.match}% match
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1.5 text-sm rounded-lg transition-colors">
                    Voir détails
                  </button>
                  <button className="text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 px-3 py-1.5 text-sm rounded-lg transition-colors">
                    Postuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compétences et CV */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Mon profil professionnel
          </h2>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Compétences principales
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                JavaScript
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                React
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                Node.js
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                TypeScript
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                SQL
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Statut de votre CV
              </h3>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  CV à jour
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/worker/profile"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center"
            >
              Mettre à jour mon profil
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
