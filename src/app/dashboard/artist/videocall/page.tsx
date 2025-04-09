"use client";

import VideoCall from "@/app/components/VideoCall";

export default function ArtistVideoCall() {
  // Pour simuler un ID unique utilisateur (à remplacer par Firebase uid plus tard)
  const mockUserId = "artist789";

  // Générer un nom de salle à partir de l'ID utilisateur
  const roomName = `omshina-meeting-${mockUserId}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mon audition vidéo
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Audition artistique
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Rencontre avec le comité artistique international
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
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
                Aujourd&apos;hui à 16:00
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Format
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Présentation et discussion
              </p>
            </div>

            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 dark:text-green-400 mb-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path
                  fillRule="evenodd"
                  d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Préparation
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Portfolio finalisé
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
                40 minutes
              </p>
            </div>
          </div>

          <div className="glass-card p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Conseils pour votre audition
            </h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                Préparez une présentation succincte de votre parcours artistique
              </li>
              <li>
                Soyez prêt à présenter et expliquer quelques œuvres clés de
                votre portfolio
              </li>
              <li>
                Anticipez des questions sur vos influences et votre vision
                artistique
              </li>
              <li>
                Préparez vos dispositifs de partage d&apos;écran pour montrer
                votre travail
              </li>
              <li>
                Réfléchissez à ce que vous attendez de cette collaboration
                internationale
              </li>
            </ul>
          </div>
        </div>

        <VideoCall
          roomName={roomName}
          userType="artist"
          userName="Sophie Leclerc"
        />
      </div>
    </div>
  );
}
