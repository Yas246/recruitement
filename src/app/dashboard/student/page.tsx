"use client";

import ProgressBar from "@/app/components/ProgressBar";
import Link from "next/link";

export default function StudentDashboard() {
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
      sender: "Conseiller OMSHINA",
      preview: "Veuillez compléter votre dossier de candidature...",
      date: "Aujourd'hui, 14:30",
      unread: true,
    },
    {
      id: 2,
      sender: "Support technique",
      preview: "Votre demande a bien été prise en compte...",
      date: "Hier, 09:15",
      unread: false,
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Progression */}
        <div className="glass-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Progression de votre dossier
          </h2>

          <ProgressBar steps={progressSteps} />

          <div className="mt-3 sm:mt-6">
            <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              Votre progression est en bonne voie. Pour continuer, veuillez
              compléter votre dossier de candidature.
            </p>

            <Link
              href="/dashboard/student/application"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-full inline-flex items-center transition-colors"
            >
              Compléter ma candidature
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Messages récents */}
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Messages récents
              </h2>

              <Link
                href="/dashboard/student/messages"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm font-medium"
              >
                Voir tous
              </Link>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-2 sm:pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {message.sender}
                        {message.unread && (
                          <span className="ml-1.5 inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                        )}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 sm:mt-1 truncate">
                        {message.preview}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                      {message.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="glass-card p-4 sm:p-6 lg:col-span-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Prochaines étapes
            </h2>

            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <span className="text-xs">1</span>
                  </div>
                </div>
                <div className="ml-2 sm:ml-3">
                  <h3 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                    Finaliser votre dossier de candidature
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 sm:mt-1">
                    Complétez votre dossier en renseignant toutes les
                    informations requises et en téléchargeant les documents
                    demandés.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <span className="text-xs">2</span>
                  </div>
                </div>
                <div className="ml-2 sm:ml-3">
                  <h3 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                    Préparation à l&apos;entretien
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 sm:mt-1">
                    Une fois votre dossier validé, préparez-vous pour
                    l&apos;entretien en consultant nos conseils et ressources
                    disponibles.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <span className="text-xs">3</span>
                  </div>
                </div>
                <div className="ml-2 sm:ml-3">
                  <h3 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                    Démarches administratives
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 sm:mt-1">
                    Après acceptation, nous vous accompagnerons dans les
                    démarches administratives (visa, logement, etc.).
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Ressources utiles */}
          <div className="glass-card p-4 sm:p-6 lg:col-span-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Ressources utiles
            </h2>

            <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              <li>
                <a
                  href="#"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Guide de l&apos;étudiant international
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Préparation aux entretiens
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Informations sur les visas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Liste des partenaires universitaires
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
