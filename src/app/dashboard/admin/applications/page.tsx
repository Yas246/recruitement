"use client";

import Link from "next/link";
import { useState } from "react";

interface Application {
  id: string;
  applicantName: string;
  applicantEmail: string;
  type: "student" | "worker" | "artist";
  status: "pending" | "approved" | "rejected" | "reviewing";
  submissionDate: string;
  country: string;
  program?: string;
  position?: string;
  portfolio?: string;
}

export default function AdminApplications() {
  // Données factices pour les candidatures
  const [applications] = useState<Application[]>([
    {
      id: "APP001",
      applicantName: "Marie Dubois",
      applicantEmail: "marie.dubois@exemple.com",
      type: "student",
      status: "pending",
      submissionDate: "2023-05-30",
      country: "Canada",
      program: "Master en sciences informatiques",
    },
    {
      id: "APP002",
      applicantName: "Thomas Bernard",
      applicantEmail: "thomas.bernard@exemple.com",
      type: "worker",
      status: "reviewing",
      submissionDate: "2023-05-28",
      country: "Allemagne",
      position: "Développeur frontend senior",
    },
    {
      id: "APP003",
      applicantName: "Sophie Laurent",
      applicantEmail: "sophie.laurent@exemple.com",
      type: "artist",
      status: "pending",
      submissionDate: "2023-05-25",
      country: "Japon",
      portfolio: "https://portfolio.sophie-laurent.com",
    },
    {
      id: "APP004",
      applicantName: "Lucas Moreau",
      applicantEmail: "lucas.moreau@exemple.com",
      type: "student",
      status: "approved",
      submissionDate: "2023-05-20",
      country: "États-Unis",
      program: "Bachelor en économie",
    },
    {
      id: "APP005",
      applicantName: "Julie Petit",
      applicantEmail: "julie.petit@exemple.com",
      type: "worker",
      status: "rejected",
      submissionDate: "2023-05-18",
      country: "Espagne",
      position: "Ingénieur logiciel",
    },
    {
      id: "APP006",
      applicantName: "Antoine Martin",
      applicantEmail: "antoine.martin@exemple.com",
      type: "artist",
      status: "reviewing",
      submissionDate: "2023-05-15",
      country: "Royaume-Uni",
      portfolio: "https://antoine-martin.art",
    },
    {
      id: "APP007",
      applicantName: "Camille Durand",
      applicantEmail: "camille.durand@exemple.com",
      type: "student",
      status: "pending",
      submissionDate: "2023-06-01",
      country: "Australie",
      program: "Licence en arts visuels",
    },
    {
      id: "APP008",
      applicantName: "Maxime Leroy",
      applicantEmail: "maxime.leroy@exemple.com",
      type: "worker",
      status: "pending",
      submissionDate: "2023-05-29",
      country: "Suisse",
      position: "Chef de projet digital",
    },
    {
      id: "APP009",
      applicantName: "Emma Lemoine",
      applicantEmail: "emma.lemoine@exemple.com",
      type: "artist",
      status: "pending",
      submissionDate: "2023-05-26",
      country: "Italie",
      portfolio: "https://emmalemoine.portfolio.io",
    },
  ]);

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] =
    useState<keyof Application>("submissionDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fonction pour filtrer les candidatures
  const filteredApplications = applications
    .filter((app) => {
      // Filtrer par terme de recherche
      const searchMatch =
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.country.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtrer par type
      const typeMatch = typeFilter === "all" || app.type === typeFilter;

      // Filtrer par statut
      const statusMatch = statusFilter === "all" || app.status === statusFilter;

      return searchMatch && typeMatch && statusMatch;
    })
    // Trier les résultats
    .sort((a, b) => {
      const aValue = a[sortField as keyof Application] as string | number;
      const bValue = b[sortField as keyof Application] as string | number;

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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des candidatures
        </h1>
        <div className="flex space-x-2">
          <Link
            href="/dashboard/admin/applications/export"
            className="btn-secondary flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Exporter
          </Link>
          <Link href="/dashboard/admin" className="btn-primary">
            Tableau de bord
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="glass-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              placeholder="Nom, email, ID, pays..."
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
                <option value="country">Pays</option>
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
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {applications.filter((app) => app.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              En attente
            </div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {applications.filter((app) => app.status === "reviewing").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              En révision
            </div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {applications.filter((app) => app.status === "approved").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Approuvées
            </div>
          </div>
          <div className="text-center bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {applications.filter((app) => app.status === "rejected").length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Candidat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Soumission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Détails
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {app.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {app.applicantName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {app.applicantEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getTypeBadge(app.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {app.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(app.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/admin/application/${app.id}`}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Voir
                        </Link>
                        {app.status === "pending" && (
                          <button
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            onClick={() => {
                              // Logique à implémenter
                              alert(`Approuver ${app.id}`);
                            }}
                          >
                            Approuver
                          </button>
                        )}
                        {(app.status === "pending" ||
                          app.status === "reviewing") && (
                          <button
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {
                              // Logique à implémenter
                              alert(`Rejeter ${app.id}`);
                            }}
                          >
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
                    className="px-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300"
                  >
                    Aucune candidature ne correspond à vos critères de
                    recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
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
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
