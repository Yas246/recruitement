"use client";

import VideoCall from "@/app/components/VideoCall";

export default function OtherVideoCall() {
  // Pour simuler un ID unique utilisateur (à remplacer par Firebase uid plus tard)
  const mockUserId = "other101";

  // Générer un nom de salle à partir de l'ID utilisateur
  const roomName = `omshina-meeting-${mockUserId}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mon entretien vidéo
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Entretien de consultation
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discussion avec un conseiller OMSHINA International
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
                Aujourd&apos;hui à 13:00
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
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Interlocuteur
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Conseiller spécialisé
              </p>
            </div>

            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 dark:text-green-400 mb-2"
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
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Type
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Consultation personnalisée
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
                45 minutes
              </p>
            </div>
          </div>

          <div className="glass-card p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Objectifs de l&apos;entretien
            </h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Définir précisément vos objectifs et besoins</li>
              <li>
                Identifier les services OMSHINA les plus adaptés à votre
                situation
              </li>
              <li>
                Établir un plan d&apos;action personnalisé pour votre projet
                international
              </li>
              <li>Répondre à toutes vos questions concernant les démarches</li>
              <li>
                Vous présenter les prochaines étapes de votre accompagnement
              </li>
            </ul>
          </div>
        </div>

        <VideoCall
          roomName={roomName}
          userType="other"
          userName="Alex Dubois"
        />
      </div>
    </div>
  );
}
