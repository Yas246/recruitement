"use client";

import VideoCall from "@/app/components/VideoCall";

export default function StudentVideoCall() {
  // Pour simuler un ID unique utilisateur (à remplacer par Firebase uid plus tard)
  const mockUserId = "student123";

  // Générer un nom de salle à partir de l'ID utilisateur
  const roomName = `omshina-meeting-${mockUserId}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mon entretien d&apos;admission
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Entretien d&apos;admission
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discussion avec le comité d&apos;admission de l&apos;université
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
                Aujourd&apos;hui à 15:30
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
                Questions-réponses
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
                Préparation
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Dossier complet
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
                30 minutes
              </p>
            </div>
          </div>

          <div className="glass-card p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Conseils pour réussir votre entretien
            </h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                Faites des recherches sur le programme et l&apos;université
              </li>
              <li>
                Préparez-vous à parler de vos objectifs académiques et
                professionnels
              </li>
              <li>
                Soyez prêt à discuter de vos forces et de vos centres
                d&apos;intérêt
              </li>
              <li>
                Préparez des questions pertinentes à poser aux examinateurs
              </li>
              <li>Soyez ponctuel et présentable lors de l&apos;appel vidéo</li>
            </ul>
          </div>
        </div>

        <VideoCall
          roomName={roomName}
          userType="student"
          userName="Marie Dupont"
        />
      </div>
    </div>
  );
}
