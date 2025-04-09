"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Types pour les statistiques
interface StatCount {
  name: string;
  count: number;
}

interface TimeSeriesData {
  date: string;
  students: number;
  workers: number;
  artists: number;
}

interface TopCountry {
  name: string;
  count: number;
  percentage: number;
}

// Page principale des statistiques
export default function StatisticsPage() {
  // Onglets de statistiques
  const [activeTab, setActiveTab] = useState<
    "overview" | "applications" | "users" | "activity"
  >("overview");

  // Données pour les graphiques (simulées)
  const userTypeData: StatCount[] = [
    { name: "Étudiants", count: 248 },
    { name: "Travailleurs", count: 142 },
    { name: "Artistes", count: 73 },
  ];

  const applicationStatusData: StatCount[] = [
    { name: "En attente", count: 63 },
    { name: "En cours de revue", count: 42 },
    { name: "Approuvées", count: 105 },
    { name: "Rejetées", count: 38 },
  ];

  const applicationTimeData: TimeSeriesData[] = [
    { date: "2023-01", students: 12, workers: 8, artists: 3 },
    { date: "2023-02", students: 15, workers: 10, artists: 5 },
    { date: "2023-03", students: 18, workers: 12, artists: 6 },
    { date: "2023-04", students: 20, workers: 15, artists: 7 },
    { date: "2023-05", students: 22, workers: 16, artists: 8 },
    { date: "2023-06", students: 25, workers: 18, artists: 9 },
  ];

  const topCountries: TopCountry[] = [
    { name: "France", count: 87, percentage: 18.8 },
    { name: "Maroc", count: 63, percentage: 13.6 },
    { name: "Sénégal", count: 52, percentage: 11.2 },
    { name: "Canada", count: 45, percentage: 9.7 },
    { name: "Côte d'Ivoire", count: 38, percentage: 8.2 },
  ];

  const userActivityData: StatCount[] = [
    { name: "Documents téléchargés", count: 287 },
    { name: "Messages envoyés", count: 423 },
    { name: "Connexions", count: 845 },
    { name: "Candidatures soumises", count: 214 },
  ];

  const conversionData: StatCount[] = [
    { name: "Visites", count: 1250 },
    { name: "Inscriptions", count: 462 },
    { name: "Candidatures débutées", count: 325 },
    { name: "Candidatures complétées", count: 248 },
  ];

  // Couleurs pour les graphiques
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Statistiques et Activités
        </h1>
        <Link href="/dashboard/admin" className="btn-primary">
          Tableau de bord
        </Link>
      </div>

      {/* Navigation des onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "applications"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Candidatures
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "users"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "activity"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Activité
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Répartition des utilisateurs
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      formatter={(value) => [`${value} utilisateurs`, "Nombre"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Statut des candidatures
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      formatter={(value) => [`${value} candidatures`, "Nombre"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Activité récente
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userActivityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Évolution des candidatures
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={applicationTimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#0088FE"
                    name="Étudiants"
                  />
                  <Line
                    type="monotone"
                    dataKey="workers"
                    stroke="#00C49F"
                    name="Travailleurs"
                  />
                  <Line
                    type="monotone"
                    dataKey="artists"
                    stroke="#FFBB28"
                    name="Artistes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "applications" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Candidatures par statut
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={applicationStatusData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Taux de conversion
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Statistiques des candidatures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  248
                </p>
                <span className="text-sm text-green-500">
                  +12% par rapport au mois précédent
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Taux d'approbation
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  73.4%
                </p>
                <span className="text-sm text-green-500">
                  +2.1% par rapport au mois précédent
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Temps moyen de traitement
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  4.2 jours
                </p>
                <span className="text-sm text-red-500">
                  +0.5 jour par rapport au mois précédent
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Candidatures en attente
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  63
                </p>
                <span className="text-sm text-green-500">
                  -7% par rapport au mois précédent
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Répartition par type d'utilisateur
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userTypeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Top 5 des pays d'origine
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCountries}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} utilisateurs`, "Nombre"]}
                    />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Statistiques des utilisateurs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Utilisateurs actifs
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  342
                </p>
                <span className="text-sm text-green-500">
                  +8% par rapport au mois précédent
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Nouveaux utilisateurs
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  72
                </p>
                <span className="text-sm text-green-500">
                  +15% par rapport au mois précédent
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Taux de rétention
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  87.3%
                </p>
                <span className="text-sm text-green-500">
                  +1.2% par rapport au mois précédent
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Utilisateurs inactifs
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  121
                </p>
                <span className="text-sm text-red-500">
                  +4% par rapport au mois précédent
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Activité des utilisateurs
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userActivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Activités récentes
            </h3>
            <div className="space-y-4">
              {[
                {
                  user: "Alexandre Dupont",
                  action: "a soumis sa candidature étudiant",
                  time: "Il y a 2 heures",
                  type: "student",
                },
                {
                  user: "Maria Silva",
                  action: "a téléchargé ses documents",
                  time: "Il y a 3 heures",
                  type: "worker",
                },
                {
                  user: "Jean Lambert",
                  action: "a mis à jour son portfolio",
                  time: "Il y a 5 heures",
                  type: "artist",
                },
                {
                  user: "Sophie Martin",
                  action: "a complété son entretien",
                  time: "Il y a 8 heures",
                  type: "student",
                },
                {
                  user: "Olivier Giroud",
                  action: "a envoyé un message à l'administration",
                  time: "Il y a 12 heures",
                  type: "worker",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      activity.type === "student"
                        ? "bg-blue-500"
                        : activity.type === "worker"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {activity.user.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.user} {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
