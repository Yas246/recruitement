"use client";

import AdminRoute from "@/app/components/AdminRoute";
import { ProgressStep } from "@/app/types/common";
import { firestoreService, FirestoreDocument } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface StudentApplication extends FirestoreDocument {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  educationInfo: {
    lastDiploma: string;
    school: string;
    targetFormation: string;
  };
  motivationLetter: string;
  progressSteps: ProgressStep[];
  status: "draft" | "submitted" | "reviewing" | "accepted" | "rejected";
  submittedAt?: Timestamp;
  updatedAt: Timestamp;
}

interface WorkerApplication extends FirestoreDocument {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  professionalInfo: {
    experience: string;
    skills: string[];
    desiredPosition: string;
    availability: string;
  };
  motivationLetter: string;
  progressSteps: ProgressStep[];
  status: "draft" | "submitted" | "reviewing" | "accepted" | "rejected";
  submittedAt?: Timestamp;
  updatedAt: Timestamp;
}

interface ArtistApplication extends FirestoreDocument {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  artisticInfo: {
    style: string;
    medium: string[];
    experience: string;
    exhibitions: string;
    awards: string;
  };
  motivationLetter: string;
  progressSteps: ProgressStep[];
  status: "draft" | "submitted" | "reviewing" | "accepted" | "rejected";
  submittedAt?: Timestamp;
  updatedAt: Timestamp;
}

interface Application {
  id: string;
  applicantName: string;
  applicantEmail: string;
  type: "student" | "worker" | "artist";
  status: "pending" | "approved" | "rejected" | "reviewing";
  submissionDate: Date | string;
  country: string;
  program?: string;
  position?: string;
  portfolio?: string;
  formattedDate?: string;
}

export default function AdminApplications() {
  // États pour les candidatures et le chargement
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] =
    useState<keyof Application>("submissionDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fonction utilitaire pour convertir les timestamps en Date
  const convertToDate = (timestamp: unknown): Date => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return new Date(); // Fallback si aucune date valide n'est trouvée
  };

  // Récupérer les données depuis Firestore
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Récupérer les candidatures étudiantes
        const studentApplications =
          await firestoreService.getAllDocuments<StudentApplication>(
            "studentApplications"
          );

        // Récupérer les candidatures des travailleurs
        const workerApplications =
          await firestoreService.getAllDocuments<WorkerApplication>(
            "workerApplications"
          );

        // Récupérer les candidatures des artistes
        const artistApplications =
          await firestoreService.getAllDocuments<ArtistApplication>(
            "artistApplications"
          );

        // Formater les candidatures étudiantes pour l'affichage
        const formattedStudentApplications: Application[] =
          studentApplications.map((app) => ({
            id: app.id,
            applicantName: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
            applicantEmail: app.personalInfo.email,
            type: "student" as const,
            status:
              app.status === "submitted"
                ? "pending"
                : app.status === "accepted"
                ? "approved"
                : app.status === "rejected"
                ? "rejected"
                : "reviewing",
            submissionDate: convertToDate(app.submittedAt || app.updatedAt),
            country: "France",
            program: app.educationInfo.targetFormation,
            formattedDate: formatTimestamp(app.submittedAt || app.updatedAt),
          }));

        // Formater les candidatures des travailleurs pour l'affichage
        const formattedWorkerApplications: Application[] =
          workerApplications.map((app) => ({
            id: app.id,
            applicantName: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
            applicantEmail: app.personalInfo.email,
            type: "worker" as const,
            status:
              app.status === "submitted"
                ? "pending"
                : app.status === "accepted"
                ? "approved"
                : app.status === "rejected"
                ? "rejected"
                : "reviewing",
            submissionDate: convertToDate(app.submittedAt || app.updatedAt),
            country: "France",
            position: app.professionalInfo.desiredPosition,
            formattedDate: formatTimestamp(app.submittedAt || app.updatedAt),
          }));

        // Formater les candidatures des artistes pour l'affichage
        const formattedArtistApplications: Application[] =
          artistApplications.map((app) => ({
            id: app.id,
            applicantName: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
            applicantEmail: app.personalInfo.email,
            type: "artist" as const,
            status:
              app.status === "submitted"
                ? "pending"
                : app.status === "accepted"
                ? "approved"
                : app.status === "rejected"
                ? "rejected"
                : "reviewing",
            submissionDate: convertToDate(app.submittedAt || app.updatedAt),
            country: "France",
            portfolio: app.artisticInfo.style, // On utilise le style comme information de portfolio
            formattedDate: formatTimestamp(app.submittedAt || app.updatedAt),
          }));

        // Combiner les trois listes
        setApplications([
          ...formattedStudentApplications,
          ...formattedWorkerApplications,
          ...formattedArtistApplications,
        ]);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des candidatures:",
          error
        );
        setError(
          "Une erreur est survenue lors du chargement des candidatures."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Fonction pour formater les timestamps Firestore
  const formatTimestamp = (
    timestamp: Timestamp | string | undefined
  ): string => {
    if (!timestamp) return "Date inconnue";

    // Convertir en date si c'est un Timestamp
    let date;
    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else {
      return "Date inconnue";
    }

    return date.toLocaleDateString();
  };

  // Fonction pour mettre à jour le statut d'une candidature
  const updateApplicationStatus = async (
    appId: string,
    newStatus: Application["status"]
  ) => {
    try {
      // Trouver l'application dans la liste
      const application = applications.find((app) => app.id === appId);
      if (!application) return;

      // Déterminer la collection et le statut approprié
      const collection =
        application.type === "student"
          ? "studentApplications"
          : application.type === "worker"
          ? "workerApplications"
          : "artistApplications";
      const appStatus =
        newStatus === "approved"
          ? "accepted"
          : newStatus === "rejected"
          ? "rejected"
          : newStatus === "reviewing"
          ? "reviewing"
          : "submitted";

      // Mettre à jour le statut dans la base de données
      await firestoreService.updateDocument(collection, appId, {
        status: appStatus,
        updatedAt: Timestamp.now(),
      });

      // Mettre à jour l'état local
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );

      toast.success(
        `Candidature ${
          newStatus === "approved" ? "approuvée" : "rejetée"
        } avec succès`
      );
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut:`, error);
      toast.error("Une erreur est survenue lors de la mise à jour du statut");
    }
  };

  // Fonction pour filtrer les candidatures
  const filteredApplications = applications
    .filter((app) => {
      // Filtrer par terme de recherche
      const searchMatch =
        (app.applicantName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (app.applicantEmail?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (app.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (app.country?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      // Filtrer par type
      const typeMatch = typeFilter === "all" || app.type === typeFilter;

      // Filtrer par statut
      const statusMatch = statusFilter === "all" || app.status === statusFilter;

      return searchMatch && typeMatch && statusMatch;
    })
    // Trier les résultats
    .sort((a, b) => {
      // Gestion spéciale pour les timestamps
      if (sortField === "submissionDate") {
        const aTimestamp = a.submissionDate;
        const bTimestamp = b.submissionDate;

        // Convertir en Date
        const aDate =
          typeof aTimestamp === "string"
            ? new Date(aTimestamp)
            : aTimestamp instanceof Timestamp
            ? aTimestamp.toDate()
            : new Date(0);

        const bDate =
          typeof bTimestamp === "string"
            ? new Date(bTimestamp)
            : bTimestamp instanceof Timestamp
            ? bTimestamp.toDate()
            : new Date(0);

        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      // Pour les autres champs
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortDirection === "asc" ? -1 : 1;
      if (bValue === undefined) return sortDirection === "asc" ? 1 : -1;

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Fonction pour gérer le changement de tri
  const handleSort = (field: keyof Application) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calcul des statistiques
  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const reviewingCount = applications.filter(
    (app) => app.status === "reviewing"
  ).length;
  const approvedCount = applications.filter(
    (app) => app.status === "approved"
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  // Fonction pour afficher le badge de type
  const getTypeBadge = (type: Application["type"]) => {
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
      default:
        return null;
    }
  };

  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            En attente
          </span>
        );
      case "reviewing":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            En révision
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Approuvée
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Rejetée
          </span>
        );
      default:
        return null;
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
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des candidatures
          </h1>
          <div className="flex gap-2">
            <Link href="/dashboard/admin" className="btn-primary">
              Tableau de bord
            </Link>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="glass-card p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Rechercher
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nom, email, ID..."
              />
            </div>

            <div>
              <label
                htmlFor="typeFilter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Type de candidature
              </label>
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les types</option>
                <option value="student">Étudiants</option>
                <option value="worker">Travailleurs</option>
                <option value="artist">Artistes</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="statusFilter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Statut
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="reviewing">En révision</option>
                <option value="approved">Approuvée</option>
                <option value="rejected">Rejetée</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sortOptions"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Trier par
              </label>
              <div className="flex space-x-2">
                <select
                  id="sortOptions"
                  value={sortField}
                  onChange={(e) =>
                    handleSort(e.target.value as keyof Application)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="submissionDate">Date de soumission</option>
                  <option value="applicantName">Nom</option>
                  <option value="type">Type</option>
                  <option value="status">Statut</option>
                </select>
                <button
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  title={
                    sortDirection === "asc"
                      ? "Trier par ordre décroissant"
                      : "Trier par ordre croissant"
                  }
                >
                  {sortDirection === "asc" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="text-center bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                {pendingCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                En attente
              </div>
            </div>
            <div className="text-center bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {reviewingCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                En révision
              </div>
            </div>
            <div className="text-center bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {approvedCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Approuvées
              </div>
            </div>
            <div className="text-center bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {rejectedCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Rejetées
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des candidatures */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Candidat
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>

                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Soumission
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Détails
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800/20 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                          {app.applicantName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {app.applicantEmail}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        {getTypeBadge(app.type)}
                      </td>

                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {app.formattedDate}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {app.type === "student" && app.program}
                        {app.type === "worker" && app.position}
                        {app.type === "artist" && (
                          <a
                            href={app.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            Portfolio →
                          </a>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-1.5">
                          <Link
                            href={`/dashboard/admin/application/${app.id}`}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Voir
                          </Link>
                          {app.status === "pending" && (
                            <button
                              onClick={() =>
                                updateApplicationStatus(app.id, "approved")
                              }
                              className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Approuver
                            </button>
                          )}
                          {(app.status === "pending" ||
                            app.status === "reviewing") && (
                            <button
                              onClick={() =>
                                updateApplicationStatus(app.id, "rejected")
                              }
                              className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Rejeter
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 sm:px-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300"
                    >
                      {applications.length === 0
                        ? "Aucune candidature disponible."
                        : "Aucune candidature ne correspond à vos critères de recherche."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de{" "}
            <span className="font-medium">{filteredApplications.length}</span>{" "}
            candidature(s) sur{" "}
            <span className="font-medium">{applications.length}</span> au total
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
              disabled
            >
              Précédent
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
