"use client";

import Link from "next/link";
import { useState } from "react";

interface Settings {
  general: {
    platformName: string;
    adminEmail: string;
    logoUrl: string;
    primaryColor: string;
    announcementEnabled: boolean;
    announcementText: string;
  };
  applications: {
    studentApplicationsEnabled: boolean;
    workerApplicationsEnabled: boolean;
    artistApplicationsEnabled: boolean;
    maxFileSizeMB: number;
    allowedFileTypes: string[];
    autoApproveDocuments: boolean;
  };
  notifications: {
    emailNotificationsEnabled: boolean;
    newApplicationNotification: boolean;
    documentUploadNotification: boolean;
    applicationStatusChangeNotification: boolean;
    messageNotification: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    loginAttempts: number;
    passwordMinLength: number;
    sessionTimeoutMinutes: number;
    twoFactorAuthEnabled: boolean;
  };
}

export default function AdminSettings() {
  // État pour les paramètres de la plateforme
  const [settings, setSettings] = useState<Settings>({
    general: {
      platformName: "OMSHINA International Recruitment",
      adminEmail: "admin@omshina-recruitment.com",
      logoUrl: "/logo.png",
      primaryColor: "#0077cc",
      announcementEnabled: true,
      announcementText:
        "Nouvelles opportunités de recrutement international disponibles!",
    },
    applications: {
      studentApplicationsEnabled: true,
      workerApplicationsEnabled: true,
      artistApplicationsEnabled: true,
      maxFileSizeMB: 10,
      allowedFileTypes: ["pdf", "docx", "jpg", "png"],
      autoApproveDocuments: false,
    },
    notifications: {
      emailNotificationsEnabled: true,
      newApplicationNotification: true,
      documentUploadNotification: true,
      applicationStatusChangeNotification: true,
      messageNotification: true,
    },
    security: {
      requireEmailVerification: true,
      loginAttempts: 5,
      passwordMinLength: 8,
      sessionTimeoutMinutes: 60,
      twoFactorAuthEnabled: false,
    },
  });

  // État pour la section active
  const [activeSection, setActiveSection] = useState("general");

  // Fonction pour mettre à jour les paramètres généraux
  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : null;

    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  // Fonction pour mettre à jour les paramètres d'applications
  const handleApplicationsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : null;

    if (name === "allowedFileTypes") {
      // Gestion des types de fichiers autorisés (tableau)
      const fileTypes = value.split(",").map((type) => type.trim());
      setSettings({
        ...settings,
        applications: {
          ...settings.applications,
          allowedFileTypes: fileTypes,
        },
      });
    } else {
      setSettings({
        ...settings,
        applications: {
          ...settings.applications,
          [name]:
            type === "checkbox"
              ? checked
              : name === "maxFileSizeMB"
              ? parseInt(value)
              : value,
        },
      });
    }
  };

  // Fonction pour mettre à jour les paramètres de notifications
  const handleNotificationsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: checked,
      },
    });
  };

  // Fonction pour mettre à jour les paramètres de sécurité
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? e.target.checked : null;

    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [name]:
          type === "checkbox"
            ? checked
            : [
                "loginAttempts",
                "passwordMinLength",
                "sessionTimeoutMinutes",
              ].includes(name)
            ? parseInt(value)
            : value,
      },
    });
  };

  // Fonction pour sauvegarder les paramètres
  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans une application réelle, envoyez les paramètres au serveur ici
    alert("Paramètres sauvegardés avec succès!");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Paramètres de la plateforme
        </h1>
        <Link href="/dashboard/admin" className="btn-primary">
          Tableau de bord
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Menu de navigation latéral */}
        <div className="glass-card p-4">
          <nav className="space-y-1">
            <button
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeSection === "general"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => setActiveSection("general")}
            >
              Paramètres généraux
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeSection === "applications"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => setActiveSection("applications")}
            >
              Paramètres de candidature
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeSection === "notifications"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => setActiveSection("notifications")}
            >
              Paramètres de notification
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeSection === "security"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => setActiveSection("security")}
            >
              Paramètres de sécurité
            </button>
          </nav>
        </div>

        {/* Formulaire des paramètres */}
        <div className="glass-card p-6 md:col-span-3">
          <form onSubmit={saveSettings}>
            {/* Paramètres généraux */}
            {activeSection === "general" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Paramètres généraux
                </h2>

                <div>
                  <label
                    htmlFor="platformName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Nom de la plateforme
                  </label>
                  <input
                    type="text"
                    id="platformName"
                    name="platformName"
                    value={settings.general.platformName}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adminEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email administrateur
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={settings.general.adminEmail}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="logoUrl"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    URL du logo
                  </label>
                  <input
                    type="text"
                    id="logoUrl"
                    name="logoUrl"
                    value={settings.general.logoUrl}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="primaryColor"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Couleur principale
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={settings.general.primaryColor}
                      onChange={handleGeneralChange}
                      className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      value={settings.general.primaryColor}
                      onChange={handleGeneralChange}
                      className="w-36 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="announcementEnabled"
                    name="announcementEnabled"
                    checked={settings.general.announcementEnabled}
                    onChange={handleGeneralChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="announcementEnabled"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Activer l&apos;annonce sur la page d&apos;accueil
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="announcementText"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Texte de l&apos;annonce
                  </label>
                  <textarea
                    id="announcementText"
                    name="announcementText"
                    rows={3}
                    value={settings.general.announcementText}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Paramètres de candidature */}
            {activeSection === "applications" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Paramètres de candidature
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="studentApplicationsEnabled"
                      name="studentApplicationsEnabled"
                      checked={settings.applications.studentApplicationsEnabled}
                      onChange={handleApplicationsChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="studentApplicationsEnabled"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Activer les candidatures étudiant
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="workerApplicationsEnabled"
                      name="workerApplicationsEnabled"
                      checked={settings.applications.workerApplicationsEnabled}
                      onChange={handleApplicationsChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="workerApplicationsEnabled"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Activer les candidatures travailleur
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="artistApplicationsEnabled"
                      name="artistApplicationsEnabled"
                      checked={settings.applications.artistApplicationsEnabled}
                      onChange={handleApplicationsChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="artistApplicationsEnabled"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Activer les candidatures artiste
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="maxFileSizeMB"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Taille maximale des fichiers (MB)
                  </label>
                  <input
                    type="number"
                    id="maxFileSizeMB"
                    name="maxFileSizeMB"
                    value={settings.applications.maxFileSizeMB}
                    onChange={handleApplicationsChange}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="allowedFileTypes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Types de fichiers autorisés (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    id="allowedFileTypes"
                    name="allowedFileTypes"
                    value={settings.applications.allowedFileTypes.join(", ")}
                    onChange={handleApplicationsChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoApproveDocuments"
                    name="autoApproveDocuments"
                    checked={settings.applications.autoApproveDocuments}
                    onChange={handleApplicationsChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="autoApproveDocuments"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Approuver automatiquement les documents téléchargés
                  </label>
                </div>
              </div>
            )}

            {/* Paramètres de notification */}
            {activeSection === "notifications" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Paramètres de notification
                </h2>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotificationsEnabled"
                    name="emailNotificationsEnabled"
                    checked={settings.notifications.emailNotificationsEnabled}
                    onChange={handleNotificationsChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="emailNotificationsEnabled"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Activer les notifications par email
                  </label>
                </div>

                <div className="ml-6 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newApplicationNotification"
                      name="newApplicationNotification"
                      checked={
                        settings.notifications.newApplicationNotification
                      }
                      onChange={handleNotificationsChange}
                      disabled={
                        !settings.notifications.emailNotificationsEnabled
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="newApplicationNotification"
                      className={`ml-2 block text-sm text-gray-700 dark:text-gray-300 ${
                        !settings.notifications.emailNotificationsEnabled
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      Notifier pour les nouvelles candidatures
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="documentUploadNotification"
                      name="documentUploadNotification"
                      checked={
                        settings.notifications.documentUploadNotification
                      }
                      onChange={handleNotificationsChange}
                      disabled={
                        !settings.notifications.emailNotificationsEnabled
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="documentUploadNotification"
                      className={`ml-2 block text-sm text-gray-700 dark:text-gray-300 ${
                        !settings.notifications.emailNotificationsEnabled
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      Notifier pour les documents téléchargés
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="applicationStatusChangeNotification"
                      name="applicationStatusChangeNotification"
                      checked={
                        settings.notifications
                          .applicationStatusChangeNotification
                      }
                      onChange={handleNotificationsChange}
                      disabled={
                        !settings.notifications.emailNotificationsEnabled
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="applicationStatusChangeNotification"
                      className={`ml-2 block text-sm text-gray-700 dark:text-gray-300 ${
                        !settings.notifications.emailNotificationsEnabled
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      Notifier pour les changements de statut
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="messageNotification"
                      name="messageNotification"
                      checked={settings.notifications.messageNotification}
                      onChange={handleNotificationsChange}
                      disabled={
                        !settings.notifications.emailNotificationsEnabled
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="messageNotification"
                      className={`ml-2 block text-sm text-gray-700 dark:text-gray-300 ${
                        !settings.notifications.emailNotificationsEnabled
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      Notifier pour les nouveaux messages
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Paramètres de sécurité */}
            {activeSection === "security" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Paramètres de sécurité
                </h2>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireEmailVerification"
                    name="requireEmailVerification"
                    checked={settings.security.requireEmailVerification}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="requireEmailVerification"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Exiger la vérification de l&apos;email
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="loginAttempts"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Nombre maximal de tentatives de connexion
                  </label>
                  <input
                    type="number"
                    id="loginAttempts"
                    name="loginAttempts"
                    value={settings.security.loginAttempts}
                    onChange={handleSecurityChange}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="passwordMinLength"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Longueur minimale du mot de passe
                  </label>
                  <input
                    type="number"
                    id="passwordMinLength"
                    name="passwordMinLength"
                    value={settings.security.passwordMinLength}
                    onChange={handleSecurityChange}
                    min="6"
                    max="16"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sessionTimeoutMinutes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Délai d&apos;expiration de session (minutes)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeoutMinutes"
                    name="sessionTimeoutMinutes"
                    value={settings.security.sessionTimeoutMinutes}
                    onChange={handleSecurityChange}
                    min="15"
                    max="240"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="twoFactorAuthEnabled"
                    name="twoFactorAuthEnabled"
                    checked={settings.security.twoFactorAuthEnabled}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="twoFactorAuthEnabled"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Activer l&apos;authentification à deux facteurs
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="btn-secondary mr-2"
                onClick={() => {
                  // Réinitialiser aux valeurs par défaut
                  if (
                    confirm(
                      "Êtes-vous sûr de vouloir réinitialiser les paramètres?"
                    )
                  ) {
                    window.location.reload();
                  }
                }}
              >
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                Sauvegarder les paramètres
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
