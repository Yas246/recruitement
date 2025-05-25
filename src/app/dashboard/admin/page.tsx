"use client";

import AdminRoute from "@/app/components/AdminRoute";
import { useAuth } from "@/app/contexts/AuthContext";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { limit, orderBy, Timestamp, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

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

interface Event extends FirestoreDocument {
  userId: string;
  userType: "student" | "worker" | "artist" | "all";
  userName?: string;
  eventId: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "info" | "meeting" | "deadline" | "workshop";
  link?: string;
  location?: string;
  isImportant?: boolean;
  status?: "pending" | "approved" | "rejected";
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  formattedDate?: string;
}

interface Application extends FirestoreDocument {
  id: string;
  userType: "student" | "worker" | "artist";
  userName: string;
  submittedAt: Timestamp;
  formattedDate?: string;
  status: "pending" | "approved" | "rejected";
}

// Types pour améliorer le typage des documents Firestore
interface UserDocument extends FirestoreDocument {
  id: string;
  status: "active" | "pending";
  role: "student" | "worker" | "artist";
}

interface StudentApplication extends FirestoreDocument {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
  };
  submittedAt: Timestamp;
  updatedAt: Timestamp;
}

interface WorkerApplication extends FirestoreDocument {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
  };
  submittedAt: Timestamp;
  updatedAt: Timestamp;
}

interface ArtistApplication extends FirestoreDocument {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
  };
  submittedAt: Timestamp;
  updatedAt: Timestamp;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    students: {
      total: 0,
      active: 0,
      pending: 0,
    },
    workers: {
      total: 0,
      active: 0,
      pending: 0,
    },
    artists: {
      total: 0,
      active: 0,
      pending: 0,
    },
  });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );

  // Calculer les totaux de tous les utilisateurs
  const totalUsers =
    stats.students.total + stats.workers.total + stats.artists.total;
  const totalActive =
    stats.students.active + stats.workers.active + stats.artists.active;
  const totalPending =
    stats.students.pending + stats.workers.pending + stats.artists.pending;

  // Fonction pour formater les timestamps Firestore
  const formatTimestamp = (timestamp: Timestamp | string): string => {
    if (!timestamp) return "Date inconnue";

    let date: Date;
    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else if (typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else {
      return "Date inconnue";
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `Aujourd'hui, ${date.getHours()}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Demain, ${date.getHours()}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Charger les données depuis Firestore
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.uid) return;

      setIsLoading(true);
      try {
        // 1. Récupérer les statistiques des utilisateurs
        const studentsSnapshot =
          await firestoreService.queryDocuments<UserDocument>("users", [
            where("role", "==", "student"),
          ]);

        const workersSnapshot =
          await firestoreService.queryDocuments<UserDocument>("users", [
            where("role", "==", "worker"),
          ]);

        const artistsSnapshot =
          await firestoreService.queryDocuments<UserDocument>("users", [
            where("role", "==", "artist"),
          ]);

        // 2. Récupérer les candidatures
        const [studentApps, workerApps, artistApps] = await Promise.all([
          firestoreService.queryDocuments<StudentApplication>(
            "studentApplications",
            [where("status", "==", "submitted")]
          ),
          firestoreService.queryDocuments<WorkerApplication>(
            "workerApplications",
            [where("status", "==", "submitted")]
          ),
          firestoreService.queryDocuments<ArtistApplication>(
            "artistApplications",
            [where("status", "==", "submitted")]
          ),
        ]);

        // Calculer les statistiques
        const studentsStats = {
          total: studentsSnapshot.length,
          active: studentsSnapshot.filter((doc) => doc.status === "active")
            .length,
          pending: studentApps.length,
        };

        const workersStats = {
          total: workersSnapshot.length,
          active: workersSnapshot.filter((doc) => doc.status === "active")
            .length,
          pending: workerApps.length,
        };

        const artistsStats = {
          total: artistsSnapshot.length,
          active: artistsSnapshot.filter((doc) => doc.status === "active")
            .length,
          pending: artistApps.length,
        };

        setStats({
          students: studentsStats,
          workers: workersStats,
          artists: artistsStats,
        });

        // 3. Récupérer les événements à venir
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Récupérer les événements globaux
        const globalEvents = await firestoreService.queryDocuments<Event>(
          "events",
          [
            where("date", ">=", today.toISOString().split("T")[0]),
            orderBy("date", "asc"),
            limit(3),
          ]
        );

        // Récupérer les événements spécifiques aux utilisateurs
        const userEvents: Event[] = [];
        const userTypes = ["student", "worker", "artist"];

        for (const userType of userTypes) {
          const users = await firestoreService.queryDocuments<UserDocument>(
            "users",
            [where("role", "==", userType)]
          );

          for (const user of users) {
            const userEventsCollection = `${userType}s/${user.id}/events`;
            const events = await firestoreService.queryDocuments<Event>(
              userEventsCollection,
              [
                where("date", ">=", today.toISOString().split("T")[0]),
                orderBy("date", "asc"),
              ]
            );
            if (events) {
              userEvents.push(...events);
            }
          }
        }

        // Combiner et trier tous les événements
        const allEvents = [...(globalEvents || []), ...userEvents];
        const sortedEvents = allEvents
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 3);

        const formattedEvents = sortedEvents.map((event) => ({
          ...event,
          formattedDate: `${formatEventDate(event.date)} à ${event.time}`,
        }));

        setUpcomingEvents(formattedEvents);

        // Récupérer les candidatures récentes
        const allApplications = [
          ...studentApps.map((app) => ({
            id: app.id,
            userType: "student" as const,
            userName: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
            submittedAt: app.submittedAt || app.updatedAt,
            status: "pending" as const,
          })),
          ...workerApps.map((app) => ({
            id: app.id,
            userType: "worker" as const,
            userName: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
            submittedAt: app.submittedAt || app.updatedAt,
            status: "pending" as const,
          })),
          ...artistApps.map((app) => ({
            id: app.id,
            userType: "artist" as const,
            userName: `${app.personalInfo.firstName} ${app.personalInfo.lastName}`,
            submittedAt: app.submittedAt || app.updatedAt,
            status: "pending" as const,
          })),
        ];

        // Trier et prendre les 3 plus récentes
        const sortedApplications = allApplications
          .sort((a, b) => b.submittedAt.seconds - a.submittedAt.seconds)
          .slice(0, 3);

        const formattedApplications = sortedApplications.map((application) => ({
          ...application,
          formattedDate: formatTimestamp(application.submittedAt),
        }));

        setRecentApplications(formattedApplications);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données admin:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [user?.uid]);

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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
          Tableau de bord administrateur
        </h1>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total des utilisateurs
            </h2>
            <p className="text-2xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">
              {totalUsers}
            </p>
          </div>

          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Étudiants
            </h2>
            <p className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {stats.students.total}
            </p>
          </div>

          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Travailleurs
            </h2>
            <p className="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.workers.total}
            </p>
          </div>

          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Artistes
            </h2>
            <p className="text-2xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {stats.artists.total}
            </p>
          </div>
        </div>

        {/* Événements à venir et nouvelles candidatures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Événements à venir
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.eventId}
                    className="flex items-start p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 ${
                        event.userType === "student"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : event.userType === "worker"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : event.userType === "artist"
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400"
                      }`}
                    >
                      {event.userType === "student" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      ) : event.userType === "worker" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
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
                      ) : event.userType === "artist" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                        {event.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {event.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {event.formattedDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Aucun événement à venir à afficher
                </p>
              )}
            </div>
            <Link
              href="/dashboard/admin/calendar"
              className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 text-xs sm:text-sm"
            >
              Voir tous les événements →
            </Link>
          </div>

          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Nouvelles candidatures
            </h2>
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 gap-2 xs:gap-0">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Vous avez{" "}
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  {totalPending}
                </span>{" "}
                {totalPending <= 1
                  ? "nouvelle candidature"
                  : "nouvelles candidatures"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/dashboard/admin/applications/students"
                  className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  Étudiants ({stats.students.pending})
                </Link>
                <Link
                  href="/dashboard/admin/applications/workers"
                  className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                  Travailleurs ({stats.workers.pending})
                </Link>
                <Link
                  href="/dashboard/admin/applications/artists"
                  className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                >
                  Artistes ({stats.artists.pending})
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full table-auto">
                <thead className="sr-only sm:not-sr-only">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2 px-4 sm:px-2">
                      Nom
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2 px-2">
                      Type
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2 px-2">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.length > 0 ? (
                    recentApplications.map((application) => (
                      <tr
                        key={application.id}
                        className="sm:hover:bg-gray-50 sm:dark:hover:bg-gray-800/50 transition-colors block sm:table-row border-b sm:border-b-0 border-gray-200 dark:border-gray-700 py-2 sm:py-0"
                      >
                        <td className="sm:py-3 text-sm text-gray-900 dark:text-gray-100 flex justify-between sm:table-cell px-4 sm:px-2">
                          <span className="sm:hidden font-medium text-gray-500 dark:text-gray-400">
                            Nom:
                          </span>
                          {application.userName}
                        </td>
                        <td className="sm:py-3 text-sm flex justify-between sm:table-cell px-4 sm:px-2 pt-2 sm:pt-0">
                          <span className="sm:hidden font-medium text-gray-500 dark:text-gray-400">
                            Type:
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              application.userType === "student"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : application.userType === "worker"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            }`}
                          >
                            {application.userType === "student"
                              ? "Étudiant"
                              : application.userType === "worker"
                              ? "Travailleur"
                              : "Artiste"}
                          </span>
                        </td>
                        <td className="sm:py-3 text-sm text-gray-500 dark:text-gray-400 flex justify-between sm:table-cell px-4 sm:px-2 pt-2 sm:pt-0">
                          <span className="sm:hidden font-medium text-gray-500 dark:text-gray-400">
                            Date:
                          </span>
                          {application.formattedDate}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-gray-500 dark:text-gray-400"
                      >
                        Aucune candidature en attente
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Link
              href="/dashboard/admin/applications"
              className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 text-xs sm:text-sm"
            >
              Voir toutes les candidatures →
            </Link>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}

// Fonction pour formater la date de l'événement
const formatEventDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) {
    return "Aujourd'hui";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Demain";
  } else {
    return date.toLocaleDateString();
  }
};
