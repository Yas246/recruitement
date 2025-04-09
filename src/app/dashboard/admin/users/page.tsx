"use client";

import Link from "next/link";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  type: "student" | "worker" | "artist";
  status: "active" | "pending" | "blocked";
  registrationDate: string;
  lastLogin: string;
}

export default function AdminUsers() {
  // Données fictives pour les utilisateurs
  const [users] = useState<User[]>([
    {
      id: "USR001",
      name: "Emma Bernard",
      email: "emma.bernard@exemple.com",
      type: "student",
      status: "active",
      registrationDate: "2023-04-15",
      lastLogin: "2023-06-02",
    },
    {
      id: "USR002",
      name: "Thomas Martin",
      email: "thomas.martin@exemple.com",
      type: "worker",
      status: "active",
      registrationDate: "2023-04-18",
      lastLogin: "2023-06-01",
    },
    {
      id: "USR003",
      name: "Sophie Durand",
      email: "sophie.durand@exemple.com",
      type: "artist",
      status: "pending",
      registrationDate: "2023-05-02",
      lastLogin: "2023-05-02",
    },
    {
      id: "USR004",
      name: "Lucas Petit",
      email: "lucas.petit@exemple.com",
      type: "student",
      status: "active",
      registrationDate: "2023-04-20",
      lastLogin: "2023-05-30",
    },
    {
      id: "USR005",
      name: "Julie Moreau",
      email: "julie.moreau@exemple.com",
      type: "worker",
      status: "blocked",
      registrationDate: "2023-03-12",
      lastLogin: "2023-04-25",
    },
    {
      id: "USR006",
      name: "Antoine Dubois",
      email: "antoine.dubois@exemple.com",
      type: "artist",
      status: "active",
      registrationDate: "2023-05-10",
      lastLogin: "2023-06-01",
    },
    {
      id: "USR007",
      name: "Sarah Laurent",
      email: "sarah.laurent@exemple.com",
      type: "student",
      status: "pending",
      registrationDate: "2023-05-18",
      lastLogin: "2023-05-18",
    },
    {
      id: "USR008",
      name: "Maxime Leroy",
      email: "maxime.leroy@exemple.com",
      type: "worker",
      status: "active",
      registrationDate: "2023-04-05",
      lastLogin: "2023-05-28",
    },
  ]);

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fonction pour filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    // Filtrer par terme de recherche
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrer par type
    const typeMatch = typeFilter === "all" || user.type === typeFilter;

    // Filtrer par statut
    const statusMatch = statusFilter === "all" || user.status === statusFilter;

    return searchMatch && typeMatch && statusMatch;
  });

  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status: User["status"]) => {
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
        return null;
    }
  };

  // Fonction pour afficher le badge de type
  const getTypeBadge = (type: User["type"]) => {
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des utilisateurs
        </h1>
        <Link href="/dashboard/admin/users/add" className="btn-primary">
          Ajouter un utilisateur
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="glass-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              placeholder="Rechercher par nom, email ou ID..."
            />
          </div>

          <div>
            <label
              htmlFor="typeFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Type d&apos;utilisateur
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
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="blocked">Bloqué</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getTypeBadge(user.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/admin/users/${user.id}`}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/dashboard/admin/users/${user.id}/edit`}
                          className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                        >
                          Éditer
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => {
                            // Logique de suppression à implémenter
                            alert(`Supprimer l'utilisateur ${user.name}`);
                          }}
                        >
                          Supprimer
                        </button>
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
                    Aucun utilisateur ne correspond à vos critères de recherche.
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
          <span className="font-medium">{filteredUsers.length}</span>{" "}
          utilisateur(s) sur <span className="font-medium">{users.length}</span>{" "}
          au total
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
