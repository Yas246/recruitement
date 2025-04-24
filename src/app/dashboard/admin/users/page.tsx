"use client";

import AdminRoute from "@/app/components/AdminRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface User extends FirestoreDocument {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Pour compatibilité avec le code existant
  email: string;
  role?: "student" | "worker" | "artist" | "admin";
  status?: "active" | "pending" | "blocked";
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
  formattedCreatedAt?: string;
  formattedLastLogin?: string;
}

interface UserUpdates extends FirestoreDocument {
  status?: string;
  role?: string;
  updatedAt?: Date;
  [key: string]:
    | string
    | Date
    | Timestamp
    | undefined
    | unknown[]
    | Record<string, unknown>
    | boolean
    | null;
}

const ITEMS_PER_PAGE = 10;

export default function AdminUsers() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  // États pour la boîte de dialogue de suppression
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  // Fonction pour appliquer les filtres et la pagination
  const applyFiltersAndPagination = useCallback(
    (allUsers: User[]) => {
      console.log("Application des filtres:", {
        typeFilter,
        statusFilter,
        searchTerm,
      });

      // 1. Filtrer par type (role)
      let filteredResults = allUsers;
      if (typeFilter !== "all") {
        filteredResults = filteredResults.filter(
          (user) => user.role === typeFilter
        );
      }

      // 2. Filtrer par statut
      if (statusFilter !== "all") {
        filteredResults = filteredResults.filter(
          (user) => user.status === statusFilter
        );
      }

      // 3. Filtrer par recherche
      if (searchTerm) {
        filteredResults = filteredResults.filter((user) => {
          const nameMatch =
            user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase());
          const emailMatch =
            user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
          const idMatch =
            user.id && user.id.toLowerCase().includes(searchTerm.toLowerCase());
          return nameMatch || emailMatch || idMatch;
        });
      }

      // Trier par date de création (du plus récent au plus ancien)
      filteredResults.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const dateA =
          a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
        const dateB =
          b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
        return dateB.getTime() - dateA.getTime();
      });

      // Calculer le nombre total de pages
      const calculatedTotalPages = Math.ceil(
        filteredResults.length / ITEMS_PER_PAGE
      );

      // Vérifier que la page actuelle est valide
      const validCurrentPage = Math.min(
        Math.max(1, currentPage),
        calculatedTotalPages || 1
      );
      if (validCurrentPage !== currentPage) {
        setCurrentPage(validCurrentPage);
      }

      // Appliquer la pagination
      const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
      const paginatedResults = filteredResults.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      console.log(
        `Résultats après filtrage: ${filteredResults.length}, page ${validCurrentPage}: ${paginatedResults.length}`
      );

      // Mettre à jour les résultats
      setUsers(paginatedResults);
      setTotalUsers(filteredResults.length);
      setHasMore(validCurrentPage < calculatedTotalPages);
    },
    [typeFilter, statusFilter, searchTerm, currentPage]
  );

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];

    // S'il y a moins de 6 pages au total, afficher toutes les pages
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // S'il y a plus de 5 pages, afficher la première, la dernière et quelques pages autour de la page courante
      pages.push(1);

      // Déterminer la plage de pages à afficher autour de la page courante
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Ajouter des points de suspension si nécessaire avant la plage
      if (startPage > 2) {
        pages.push("...");
      }

      // Ajouter les pages dans la plage
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Ajouter des points de suspension si nécessaire après la plage
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Ajouter la dernière page
      pages.push(totalPages);
    }

    return pages;
  };

  // Récupérer le nombre total d'utilisateurs et vérifier les données
  useEffect(() => {
    const verifyAndFixUserData = async () => {
      try {
        const snapshot = await firestoreService.getAllDocuments<User>("users");
        console.log("Total d'utilisateurs trouvés:", snapshot.length);

        // Vérifier si les utilisateurs ont les bons champs
        let needFix = false;
        for (const user of snapshot) {
          console.log(`Vérification utilisateur ${user.id}:`, {
            email: user.email,
            role: user.role,
            status: user.status,
          });

          // Vérifier si des champs importants manquent ou sont incorrects
          if (!user.status || !user.role) {
            needFix = true;
            console.log(`Utilisateur ${user.id} nécessite une correction`);
          }
        }

        // Corriger les utilisateurs avec des données manquantes
        if (needFix) {
          console.log("Correction des données utilisateur...");
          for (const user of snapshot) {
            const updates: UserUpdates = {};
            let needUpdate = false;

            // Ajouter un champ status si manquant
            if (!user.status) {
              updates.status = "active";
              needUpdate = true;
            }

            // Ajouter/corriger le champ role si nécessaire
            if (!user.role) {
              // Déterminer le rôle en fonction de l'existence dans la collection admins
              try {
                const adminDoc = await firestoreService.getDocument(
                  "admins",
                  user.id
                );
                if (adminDoc) {
                  updates.role = "admin";
                } else {
                  // Par défaut, considérer comme "student" si inconnu
                  updates.role = "student";
                }
                needUpdate = true;
              } catch (error) {
                console.error(
                  "Erreur lors de la récupération du document admin:",
                  error
                );
                updates.role = "student"; // Valeur par défaut
                needUpdate = true;
              }
            }

            // Mettre à jour l'utilisateur si nécessaire
            if (needUpdate) {
              updates.updatedAt = new Date();
              console.log(`Mise à jour de l'utilisateur ${user.id}:`, updates);
              await firestoreService.updateDocument("users", user.id, updates);
            }
          }

          // Recharger les utilisateurs après correction
          const updatedSnapshot = await firestoreService.getAllDocuments<User>(
            "users"
          );
          setTotalUsers(updatedSnapshot.length);
          console.log("Données utilisateur corrigées");
        } else {
          setTotalUsers(snapshot.length);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification des utilisateurs:",
          error
        );
        // Essayer de récupérer au moins le nombre total
        try {
          const countSnapshot = await firestoreService.getAllDocuments<User>(
            "users"
          );
          setTotalUsers(countSnapshot.length);
        } catch (error) {
          console.error(
            "Impossible de récupérer le nombre total d'utilisateurs",
            error
          );
          setTotalUsers(0);
        }
      }
    };

    verifyAndFixUserData();
  }, []);

  // Récupérer les utilisateurs depuis Firestore
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!user?.uid) return;

      setIsLoading(true);
      console.log("Chargement de tous les utilisateurs...");
      setUsers([]); // Vider la liste des utilisateurs pendant le chargement

      try {
        // Récupérer TOUS les utilisateurs sans aucun filtre (évite les problèmes d'index)
        const snapshot = await firestoreService.getAllDocuments<User>("users");
        console.log(`Total d'utilisateurs récupérés: ${snapshot.length}`);

        // Formatage des utilisateurs avec les champs nécessaires
        const formattedUsers = snapshot.map((user) => ({
          ...user,
          name:
            user.displayName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email,
          formattedCreatedAt: formatTimestamp(user.createdAt),
          formattedLastLogin: formatTimestamp(user.lastLogin),
        }));

        // Stocker tous les utilisateurs pour le filtrage
        setTotalUsers(formattedUsers.length);

        // Appliquer les filtres et la pagination en mémoire
        applyFiltersAndPagination(formattedUsers);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [user?.uid, applyFiltersAndPagination]);

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const snapshot = await firestoreService.getAllDocuments<User>("users");

        // Formatage des utilisateurs avec les champs nécessaires
        const formattedUsers = snapshot.map((user) => ({
          ...user,
          name:
            user.displayName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email,
          formattedCreatedAt: formatTimestamp(user.createdAt),
          formattedLastLogin: formatTimestamp(user.lastLogin),
        }));

        // Appliquer les filtres et la pagination
        applyFiltersAndPagination(formattedUsers);
      } catch (error) {
        console.error("Erreur lors du filtrage:", error);
      }
    };

    fetchAndFilter();
  }, [
    typeFilter,
    statusFilter,
    searchTerm,
    currentPage,
    applyFiltersAndPagination,
  ]);

  // Fonction pour changer de page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Remonter en haut de la page
  };

  // Fonction pour changer les filtres
  const handleFilterChange = (
    newTypeFilter: string,
    newStatusFilter: string
  ) => {
    console.log("Changement de filtres:", {
      ancien: { type: typeFilter, status: statusFilter },
      nouveau: { type: newTypeFilter, status: newStatusFilter },
    });

    setTypeFilter(newTypeFilter);
    setStatusFilter(newStatusFilter);
    setCurrentPage(1); // Revenir à la première page
  };

  // Fonction pour formater les timestamps Firestore
  const formatTimestamp = (timestamp: Timestamp | undefined): string => {
    if (!timestamp || typeof timestamp.toDate !== "function") {
      return "Date inconnue";
    }

    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  // Filtrer les utilisateurs pour la recherche
  // Cette fonction n'est plus nécessaire car le filtrage est fait dans applyFiltersAndPagination
  const filteredUsers = users;

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
  const getTypeBadge = (type: User["role"]) => {
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

  // Gérer la suppression d'un utilisateur
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
    setDeleteError("");
    setDeleteSuccess("");
  };

  // Fermer la boîte de dialogue de suppression
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
    // Effacer les messages après un délai
    setTimeout(() => {
      setDeleteError("");
      setDeleteSuccess("");
    }, 500);
  };

  // Fonction de suppression de l'utilisateur
  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      console.log(
        `Tentative de suppression de l'utilisateur ${userToDelete.id}`
      );

      // 1. Supprimer le document de la collection "users"
      await firestoreService.deleteDocument("users", userToDelete.id);
      console.log(`Document utilisateur supprimé de la collection "users"`);

      // 2. Vérifier et supprimer de la collection "admins" si c'est un admin
      if (userToDelete.role === "admin") {
        try {
          await firestoreService.deleteDocument("admins", userToDelete.id);
          console.log(`Document admin supprimé de la collection "admins"`);
        } catch (error) {
          console.error(
            `Erreur lors de la suppression du document admin:`,
            error
          );
          // On continue même si l'admin n'existe pas dans la collection "admins"
        }
      }

      // 3. [IMPORTANT] Pour supprimer complètement l'utilisateur de Firebase Auth,
      // il faut être connecté en tant que cet utilisateur ou utiliser l'API Admin
      // qui n'est pas disponible côté client. Cette partie devrait être gérée par
      // une fonction Cloud ou une API backend.

      // Message de succès
      setDeleteSuccess(
        `L'utilisateur ${
          userToDelete.name || userToDelete.email
        } a été supprimé avec succès.`
      );

      // Actualiser la liste des utilisateurs après suppression
      setTimeout(() => {
        // Récupérer à nouveau tous les utilisateurs
        const fetchAndFilter = async () => {
          try {
            const snapshot = await firestoreService.getAllDocuments<User>(
              "users"
            );

            // Formatage des utilisateurs avec les champs nécessaires
            const formattedUsers = snapshot.map((user) => ({
              ...user,
              name:
                user.displayName ||
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                user.email,
              formattedCreatedAt: formatTimestamp(user.createdAt),
              formattedLastLogin: formatTimestamp(user.lastLogin),
            }));

            // Appliquer les filtres et la pagination
            applyFiltersAndPagination(formattedUsers);
          } catch (error) {
            console.error(
              "Erreur lors du rechargement des utilisateurs:",
              error
            );
          }
        };

        fetchAndFilter();
        closeDeleteDialog();
      }, 2000);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur:`, error);
      setDeleteError(
        `Une erreur est survenue lors de la suppression de l'utilisateur. Veuillez réessayer.`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Afficher un indicateur de chargement
  if (isLoading && currentPage === 1) {
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
            Gestion des utilisateurs
          </h1>
          <div className="flex space-x-3">
            <Link
              href="/dashboard/admin"
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
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/admin/users/add-admin"
              className="btn-primary flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Ajouter un admin
            </Link>
          </div>
        </div>

        {/* Résumé et statistiques */}
        <div className="glass-card p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total d'utilisateurs
              </span>
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalUsers}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Utilisateurs actifs
              </span>
              <span className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {users.filter((u) => u.status === "active").length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                En attente
              </span>
              <span className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
                {users.filter((u) => u.status === "pending").length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Bloqués
              </span>
              <span className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {users.filter((u) => u.status === "blocked").length}
              </span>
            </div>
          </div>
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Rechercher par nom, email ou ID..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recherchez par nom, email ou identifiant
              </p>
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
                onChange={(e) =>
                  handleFilterChange(e.target.value, statusFilter)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les types</option>
                <option value="student">Étudiants</option>
                <option value="worker">Travailleurs</option>
                <option value="artist">Artistes</option>
                <option value="admin">Administrateurs</option>
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
                onChange={(e) => handleFilterChange(typeFilter, e.target.value)}
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
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Liste des utilisateurs ({filteredUsers.length})
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} sur {totalPages || 1}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getTypeBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.status ? (
                          getStatusBadge(user.status)
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
                            Non défini
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {user.formattedCreatedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {user.formattedLastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/dashboard/admin/users/${user.id}`}
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                          >
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Voir
                          </Link>
                          <Link
                            href={`/dashboard/admin/users/${user.id}/edit`}
                            className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center"
                          >
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Éditer
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                            onClick={() => handleDeleteClick(user)}
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
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
                      Aucun utilisateur ne correspond à vos critères de
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
            <span className="font-medium">{filteredUsers.length}</span>{" "}
            utilisateur(s) sur <span className="font-medium">{totalUsers}</span>{" "}
            au total
          </div>
          <div className="flex space-x-2 items-center">
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 flex items-center"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Précédent
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-700 dark:text-gray-300"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${
                    currentPage === page
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => handlePageChange(Number(page))}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 flex items-center"
              disabled={currentPage === totalPages || !hasMore}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Suivant
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Indicateur de chargement pour le chargement de page suivante */}
        {isLoading && currentPage > 1 && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Boîte de dialogue de confirmation de suppression */}
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                <span className="font-semibold">
                  {userToDelete?.name || userToDelete?.email}
                </span>
                ? Cette action est irréversible.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                  {deleteError}
                </div>
              )}

              {deleteSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  {deleteSuccess}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  onClick={closeDeleteDialog}
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
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
                      Suppression en cours...
                    </>
                  ) : (
                    "Confirmer la suppression"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
