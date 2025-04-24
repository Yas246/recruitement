"use client";

import AdminRoute from "@/app/components/AdminRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { firestoreService, FirestoreDocument } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData extends FirestoreDocument {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role?: "student" | "worker" | "artist" | "admin";
  status?: "active" | "pending" | "blocked";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  phoneNumber?: string;
  emailVerified?: boolean;
  photoURL?: string;
  // D'autres champs potentiels
}

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État pour le formulaire
  const [formData, setFormData] = useState({
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid || !id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await firestoreService.getDocument<UserData>(
          "users",
          id as string
        );

        if (!data) {
          setError("Utilisateur non trouvé");
          setUserData(null);
          return;
        }

        console.log("Données utilisateur récupérées:", data);
        setUserData(data);

        // Initialiser le formulaire avec les données utilisateur
        setFormData({
          displayName: data.displayName || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          role: data.role || "",
          status: data.status || "",
          phoneNumber: data.phoneNumber || "",
        });
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

    fetchUserData();
  }, [user?.uid, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData || !id) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Préparation des données à mettre à jour
      const updateData = {
        ...formData,
        updatedAt: Timestamp.now(),
      };

      // Mise à jour des données utilisateur dans Firestore
      await firestoreService.updateDocument("users", id, updateData);

      console.log("Utilisateur mis à jour avec succès:", updateData);
      setSuccess("Utilisateur mis à jour avec succès");

      // Redirection après un court délai
      setTimeout(() => {
        router.push(`/dashboard/admin/users/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
      setError(
        "Une erreur est survenue lors de la mise à jour de l'utilisateur."
      );
    } finally {
      setIsSubmitting(false);
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

  return (
    <AdminRoute>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Modifier l'utilisateur
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/dashboard/admin/users/${id}`}
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
              Retour aux détails
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            {success}
          </div>
        )}

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Email (readonly) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Email (non modifiable)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300"
                />
              </div>

              {/* Nom d'affichage */}
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Nom d'affichage
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Prénom */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Nom */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Rôle */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="student">Étudiant</option>
                  <option value="worker">Travailleur</option>
                  <option value="artist">Artiste</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              {/* Statut */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Statut
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                  <option value="blocked">Bloqué</option>
                </select>
              </div>
            </div>

            {/* Boutons de soumission */}
            <div className="flex justify-end space-x-4">
              <Link
                href={`/dashboard/admin/users/${id}`}
                className="btn-secondary"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminRoute>
  );
}
