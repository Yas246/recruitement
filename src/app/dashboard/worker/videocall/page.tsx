"use client";

import VideoCall from "@/app/components/VideoCall";

export default function WorkerVideoCall() {
  // Pour simuler un ID unique utilisateur (à remplacer par Firebase uid plus tard)
  const mockUserId = "worker456";

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
                Prochain entretien
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Entretien de recrutement avec OMSHINA International
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
                Aujourd&apos;hui à 14:30
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
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Interlocuteurs
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Recruteur OMSHINA
              </p>
            </div>

            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 dark:text-green-400 mb-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Préparation
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Documents prêts
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
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Durée estimée
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                45 minutes
              </p>
            </div>
          </div>

          <div className="glass-card p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Conseils pour votre entretien
            </h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                Assurez-vous d&apos;être dans un environnement calme et bien
                éclairé
              </li>
              <li>
                Testez votre caméra et votre microphone avant l&apos;entretien
              </li>
              <li>
                Ayez une copie de votre CV et de vos références à portée de main
              </li>
              <li>
                Préparez quelques questions à poser sur le poste et
                l&apos;entreprise
              </li>
              <li>Connectez-vous 5 minutes avant l&apos;heure prévue</li>
            </ul>
          </div>
        </div>

        <VideoCall
          roomName={roomName}
          userType="worker"
          userName="Jean Martin"
        />
      </div>
    </div>
  );
}
