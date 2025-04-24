"use client";

import AdminRoute from "@/app/components/AdminRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { firestoreService, FirestoreDocument } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UserDetail extends FirestoreDocument {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role?: "student" | "worker" | "artist" | "admin";
  status?: "active" | "pending" | "blocked";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLogin?: Timestamp;
  phoneNumber?: string;
  emailVerified?: boolean;
  photoURL?: string;
  // Autres champs potentiels
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!user?.uid || !id) return;

      setIsLoading(true);
      setError(null);

      try {
        const userData = await firestoreService.getDocument<UserDetail>(
          "users",
          id as string
        );

        if (!userData) {
          setError("Utilisateur non trouvé");
          setUserDetail(null);
          return;
        }

        console.log("Données utilisateur récupérées:", userData);
        setUserDetail(userData);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des détails de l'utilisateur:",
          err
        );
        setError(
          "Une erreur est survenue lors du chargement des données de l'utilisateur."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [user?.uid, id]);

  // Fonction pour formater les timestamps Firestore
  const formatTimestamp = (timestamp: Timestamp | undefined): string => {
    if (!timestamp || typeof timestamp.toDate !== "function") {
      return "Date inconnue";
    }

    const date = timestamp.toDate();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Actif
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            En attente
          </span>
        );
      case "blocked":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Bloqué
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
            Non défini
          </span>
        );
    }
  };

  // Fonction pour afficher le badge de type
  const getTypeBadge = (type: string | undefined) => {
    switch (type) {
      case "student":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Étudiant
          </span>
        );
      case "worker":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Travailleur
          </span>
        );
      case "artist":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            Artiste
          </span>
        );
      case "admin":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Admin
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
            Inconnu
          </span>
        );
    }
  };

  // Afficher un indicateur de chargement
  if (isLoading) {
    return (
      <AdminRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </AdminRoute>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <AdminRoute>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Détails de l'utilisateur
            </h1>
            <Link
              href="/dashboard/admin/users"
              className="btn-secondary flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour à la liste
            </Link>
          </div>

          <div className="glass-card p-8">
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Détails de l'utilisateur
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/dashboard/admin/users/${id}/edit`}
              className="btn-primary flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Modifier
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="btn-secondary flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour à la liste
            </Link>
          </div>
        </div>

        {userDetail && (
          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row">
              {/* Avatar et infos principales */}
              <div className="w-full md:w-1/3 flex flex-col items-center mb-8 md:mb-0">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {userDetail.photoURL ? (
                    <Image
                      src={userDetail.photoURL}
                      alt={userDetail.displayName || "Avatar"}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-20 w-20 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                  {userDetail.displayName ||
                    `${userDetail.firstName || ""} ${
                      userDetail.lastName || ""
                    }`.trim() ||
                    userDetail.email}
                </h2>
                <div className="flex items-center justify-center mb-4">
                  {getTypeBadge(userDetail.role)}
                </div>
                <div className="flex items-center justify-center mb-4">
                  {getStatusBadge(userDetail.status)}
                </div>
                {userDetail.emailVerified !== undefined && (
                  <div className="flex items-center justify-center mb-4">
                    {userDetail.emailVerified ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Email vérifié
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
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
                        Email non vérifié
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Informations détaillées */}
              <div className="w-full md:w-2/3 md:pl-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ID
                    </h3>
                    <p className="text-gray-900 dark:text-white break-all">
                      {userDetail.id}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Email
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {userDetail.email}
                    </p>
                  </div>

                  {/* Prénom */}
                  {userDetail.firstName && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Prénom
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {userDetail.firstName}
                      </p>
                    </div>
                  )}

                  {/* Nom */}
                  {userDetail.lastName && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Nom
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {userDetail.lastName}
                      </p>
                    </div>
                  )}

                  {/* Téléphone */}
                  {userDetail.phoneNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Téléphone
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {userDetail.phoneNumber}
                      </p>
                    </div>
                  )}

                  {/* Date de création */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Date d'inscription
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {formatTimestamp(userDetail.createdAt)}
                    </p>
                  </div>

                  {/* Dernière mise à jour */}
                  {userDetail.updatedAt && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Dernière mise à jour
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {formatTimestamp(userDetail.updatedAt)}
                      </p>
                    </div>
                  )}

                  {/* Dernière connexion */}
                  {userDetail.lastLogin && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Dernière connexion
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {formatTimestamp(userDetail.lastLogin)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Section pour les permissions admin si c'est un admin */}
                {userDetail.role === "admin" && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Permissions administrateur
                    </h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        Les permissions détaillées de cet administrateur seront
                        récupérées depuis la collection "admins".
                      </p>
                      <Link
                        href={`/dashboard/admin/users/${id}/admin-permissions`}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Voir les permissions administrateur
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
