"use client";

import VideoCall from "@/app/components/VideoCall";
import { useState } from "react";

export default function AdminVideoCall() {
  // Pour simuler un ID unique utilisateur (à remplacer par Firebase uid plus tard)
  const mockAdminId = "admin123";

  // État pour gérer les différentes réunions
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Simuler une liste d'utilisateurs pour l'admin
  const users = [
    {
      id: "student123",
      name: "Marie Dupont",
      type: "student",
      status: "En attente d'entretien",
    },
    {
      id: "worker456",
      name: "Jean Martin",
      type: "worker",
      status: "Entretien programmé",
    },
    {
      id: "artist789",
      name: "Sophie Leclerc",
      type: "artist",
      status: "Entretien terminé",
    },
  ];

  // Générer un nom de salle à partir de l'ID utilisateur
  const generateRoomName = (userId: string) => {
    return `omshina-meeting-${userId}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des entretiens vidéo
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-xl h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Candidats
            </h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg transition-colors cursor-pointer ${
                    activeRoomId === user.id
                      ? "bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500"
                      : "bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/60"
                  }`}
                  onClick={() => setActiveRoomId(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {user.type}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "En attente d'entretien"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : user.status === "Entretien programmé"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {activeRoomId ? (
            <VideoCall
              roomName={generateRoomName(activeRoomId)}
              userType="admin"
              userName="Admin OMSHINA"
            />
          ) : (
            <div className="glass-card p-6 rounded-xl h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sélectionnez un candidat
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-center">
                Choisissez un candidat dans la liste pour démarrer ou rejoindre
                un entretien vidéo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
