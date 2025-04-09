"use client";

import { useEffect, useState } from "react";

interface VideoCallProps {
  roomName: string;
  userType: "admin" | "student" | "worker" | "artist" | "other";
  userName: string;
}

export default function VideoCall({
  roomName,
  userType,
  userName,
}: VideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(true);
  const [meetingUrl, setMeetingUrl] = useState("");

  // Générer l'URL de la réunion au chargement du composant
  useEffect(() => {
    const url = `https://meet.jit.si/${roomName}`;
    setMeetingUrl(url);
  }, [roomName]);

  // Vérifier si Jitsi est chargé correctement
  useEffect(() => {
    if (isCallActive) {
      const timer = setTimeout(() => {
        // Vérifier si l'iframe est accessible
        const iframe = document.getElementById("jitsi-iframe");
        if (!iframe || (iframe as HTMLIFrameElement).contentWindow === null) {
          setIsJitsiLoaded(false);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCallActive]);

  const handleStartMeeting = () => {
    setIsCallActive(true);
    setIsJitsiLoaded(true);
  };

  const handleEndMeeting = () => {
    setIsCallActive(false);
  };

  return (
    <div className="glass-card p-6 rounded-xl w-full">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {userType === "admin"
            ? "Gérer l'entretien vidéo"
            : "Mon entretien vidéo"}
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {userType === "admin"
            ? "Créez une session d'entretien et envoyez un lien au candidat."
            : "Rejoignez votre entretien vidéo quand vous êtes prêt. Assurez-vous que votre caméra et votre micro fonctionnent correctement."}
        </p>

        {!isCallActive ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <button
              onClick={handleStartMeeting}
              className="btn-primary flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {userType === "admin"
                  ? "Créer l'entretien"
                  : "Rejoindre l'entretien"}
              </span>
            </button>

            {userType === "admin" && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  URL de la réunion (à communiquer au candidat) :
                </p>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={meetingUrl}
                    className="flex-1 text-sm p-2 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-white dark:bg-gray-900"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(meetingUrl)}
                    className="p-2 bg-primary-600 text-white rounded-r-lg"
                    title="Copier le lien"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="relative" style={{ height: "70vh" }}>
              {isJitsiLoaded ? (
                <iframe
                  id="jitsi-iframe"
                  src={`${meetingUrl}#userInfo.displayName="${userName}"`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="absolute inset-0 w-full h-full rounded-lg border-0"
                ></iframe>
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-red-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Impossible de charger l'appel vidéo
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
                    Votre connexion internet pourrait être instable ou le
                    service Jitsi Meet n'est pas disponible.
                  </p>
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary mb-4"
                  >
                    Ouvrir dans un nouvel onglet
                  </a>
                  <button
                    onClick={handleEndMeeting}
                    className="text-red-600 dark:text-red-400"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleEndMeeting}
                className="btn-secondary bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 border-0"
              >
                Quitter l'entretien
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
