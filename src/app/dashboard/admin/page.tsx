"use client";

import Link from "next/link";
import { useState } from "react";

interface UserStats {
  total: number;
  active: number;
  pending: number;
}

interface StatsData {
  students: UserStats;
  workers: UserStats;
  artists: UserStats;
}

export default function AdminDashboard() {
  // Données factices pour simuler les statistiques
  const [stats] = useState<StatsData>({
    students: {
      total: 248,
      active: 187,
      pending: 61,
    },
    workers: {
      total: 142,
      active: 94,
      pending: 48,
    },
    artists: {
      total: 73,
      active: 45,
      pending: 28,
    },
  });

  // Calculer les totaux de tous les utilisateurs
  const totalUsers =
    stats.students.total + stats.workers.total + stats.artists.total;
  const totalActive =
    stats.students.active + stats.workers.active + stats.artists.active;
  const totalPending =
    stats.students.pending + stats.workers.pending + stats.artists.pending;

  // Données factices pour les activités récentes
  const recentActivities = [
    {
      id: 1,
      userType: "student",
      userName: "Emma Bernard",
      action: "Candidature soumise",
      timestamp: "Aujourd'hui, 14:30",
    },
    {
      id: 2,
      userType: "worker",
      userName: "Thomas Martin",
      action: "Documents mis à jour",
      timestamp: "Aujourd'hui, 11:15",
    },
    {
      id: 3,
      userType: "artist",
      userName: "Sophie Durand",
      action: "Portfolio mis à jour",
      timestamp: "Aujourd'hui, 09:45",
    },
    {
      id: 4,
      userType: "student",
      userName: "Lucas Petit",
      action: "Entretien planifié",
      timestamp: "Hier, 16:20",
    },
    {
      id: 5,
      userType: "worker",
      userName: "Julie Moreau",
      action: "Candidature approuvée",
      timestamp: "Hier, 14:05",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Tableau de bord administrateur
      </h1>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total des utilisateurs
          </h2>
          <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            {totalUsers}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Actifs: {totalActive}
            </span>
            <span className="text-sm text-amber-600 dark:text-amber-400">
              En attente: {totalPending}
            </span>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Étudiants
          </h2>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {stats.students.total}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Actifs: {stats.students.active}
            </span>
            <span className="text-sm text-amber-600 dark:text-amber-400">
              En attente: {stats.students.pending}
            </span>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Travailleurs
          </h2>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {stats.workers.total}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Actifs: {stats.workers.active}
            </span>
            <span className="text-sm text-amber-600 dark:text-amber-400">
              En attente: {stats.workers.pending}
            </span>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Artistes
          </h2>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {stats.artists.total}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Actifs: {stats.artists.active}
            </span>
            <span className="text-sm text-amber-600 dark:text-amber-400">
              En attente: {stats.artists.pending}
            </span>
          </div>
        </div>
      </div>

      {/* Liens rapides */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Gestion des utilisateurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/students"
            className="btn-secondary flex items-center justify-center gap-2 py-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            Gérer les étudiants
          </Link>
          <Link
            href="/dashboard/admin/workers"
            className="btn-secondary flex items-center justify-center gap-2 py-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            Gérer les travailleurs
          </Link>
          <Link
            href="/dashboard/admin/artists"
            className="btn-secondary flex items-center justify-center gap-2 py-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Gérer les artistes
          </Link>
        </div>
      </div>

      {/* Activités récentes et nouvelles candidatures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Activités récentes
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    activity.userType === "student"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : activity.userType === "worker"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}
                >
                  {activity.userType === "student" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  ) : activity.userType === "worker" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.userName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/admin/activities"
            className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 text-sm"
          >
            Voir toutes les activités →
          </Link>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Nouvelles candidatures
          </h2>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-700 dark:text-gray-300">
              Vous avez{" "}
              <span className="font-medium text-primary-600 dark:text-primary-400">
                24
              </span>{" "}
              nouvelles candidatures à examiner.
            </p>
            <div className="flex gap-2">
              <Link
                href="/dashboard/admin/applications/students"
                className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                Étudiants (12)
              </Link>
              <Link
                href="/dashboard/admin/applications/workers"
                className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                Travailleurs (8)
              </Link>
              <Link
                href="/dashboard/admin/applications/artists"
                className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              >
                Artistes (4)
              </Link>
            </div>
          </div>

          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
                  Nom
                </th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
                  Date
                </th>
                <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="py-3 text-sm text-gray-900 dark:text-gray-100">
                  Sarah Dubois
                </td>
                <td className="py-3 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Étudiant
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  Aujourd&apos;hui
                </td>
                <td className="py-3 text-sm text-right">
                  <Link
                    href="/dashboard/admin/application/student/123"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Consulter
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="py-3 text-sm text-gray-900 dark:text-gray-100">
                  Antoine Martin
                </td>
                <td className="py-3 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Travailleur
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  Aujourd&apos;hui
                </td>
                <td className="py-3 text-sm text-right">
                  <Link
                    href="/dashboard/admin/application/worker/456"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Consulter
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="py-3 text-sm text-gray-900 dark:text-gray-100">
                  Marie Laurent
                </td>
                <td className="py-3 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    Artiste
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  Hier
                </td>
                <td className="py-3 text-sm text-right">
                  <Link
                    href="/dashboard/admin/application/artist/789"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Consulter
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
          <Link
            href="/dashboard/admin/applications"
            className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 text-sm"
          >
            Voir toutes les candidatures →
          </Link>
        </div>
      </div>
    </div>
  );
}
