"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useState } from "react";

export default function WorkerApplication() {
  const [activeTab, setActiveTab] = useState("personal");

  // Données factices pour simuler les étapes de progression
  const progressSteps = [
    { id: 1, name: "Informations personnelles", completed: true },
    { id: 2, name: "Documents requis", completed: true },
    { id: 3, name: "Candidature", completed: false, active: true },
    { id: 4, name: "Entretien", pending: true },
    { id: 5, name: "Décision finale", pending: true },
  ];

  const renderPersonalForm = () => (
    <div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-4">
        Informations personnelles
      </h3>
      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
        Veuillez compléter vos informations personnelles ci-dessous.
      </p>

      <form className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              defaultValue="John"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              defaultValue="Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            defaultValue="john.doe@example.com"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            onClick={() => setActiveTab("experience")}
          >
            Suivant
          </button>
        </div>
      </form>
    </div>
  );

  const renderExperienceForm = () => (
    <div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-4">
        Expérience professionnelle
      </h3>
      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
        Veuillez renseigner vos expériences professionnelles et compétences.
      </p>

      <form className="space-y-3 sm:space-y-4">
        <div>
          <label
            htmlFor="skills"
            className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Compétences (séparées par des virgules)
          </label>
          <input
            type="text"
            id="skills"
            className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: JavaScript, React, Node.js, SQL"
          />
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg transition-colors"
            onClick={() => setActiveTab("personal")}
          >
            Précédent
          </button>
          <button
            type="button"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            onClick={() => setActiveTab("motivation")}
          >
            Suivant
          </button>
        </div>
      </form>
    </div>
  );

  const renderMotivationForm = () => (
    <div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-4">
        Objectifs professionnels
      </h3>
      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
        Présentez vos motivations et objectifs professionnels.
      </p>

      <form className="space-y-3 sm:space-y-4">
        <div>
          <label
            htmlFor="motivation"
            className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Lettre de motivation
          </label>
          <textarea
            id="motivation"
            rows={5}
            className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Présentez vos motivations et objectifs professionnels..."
          ></textarea>
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg transition-colors"
            onClick={() => setActiveTab("experience")}
          >
            Précédent
          </button>
          <button
            type="submit"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Soumettre ma candidature
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Ma Candidature
      </h1>

      <div className="glass-card p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
          Progression de votre dossier
        </h2>
        <ProgressBar steps={progressSteps} />
        <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          Votre progression est en bonne voie. Pour continuer, veuillez
          compléter les informations de votre candidature ci-dessous.
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Onglets */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 min-w-[130px] py-2 px-4 text-center text-sm whitespace-nowrap ${
              activeTab === "personal"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Informations personnelles
          </button>
          <button
            className={`flex-1 min-w-[130px] py-2 px-4 text-center text-sm whitespace-nowrap ${
              activeTab === "experience"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("experience")}
          >
            Expérience professionnelle
          </button>
          <button
            className={`flex-1 min-w-[130px] py-2 px-4 text-center text-sm whitespace-nowrap ${
              activeTab === "motivation"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("motivation")}
          >
            Objectifs professionnels
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="p-4 sm:p-6">
          {activeTab === "personal" && renderPersonalForm()}
          {activeTab === "experience" && renderExperienceForm()}
          {activeTab === "motivation" && renderMotivationForm()}
        </div>
      </div>
    </div>
  );
}
