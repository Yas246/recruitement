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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Ma Candidature
      </h1>

      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Progression de votre dossier
        </h2>
        <ProgressBar steps={progressSteps} />
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Votre progression est en bonne voie. Pour continuer, veuillez
          compléter les informations de votre candidature ci-dessous.
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Onglets */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "personal"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Informations personnelles
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "experience"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("experience")}
          >
            Expérience professionnelle
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
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
        <div className="p-6">
          {activeTab === "personal" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Informations personnelles
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Veuillez compléter vos informations personnelles ci-dessous.
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      defaultValue="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      defaultValue="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="john.doe@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Localisation actuelle
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Paris, France"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveTab("experience")}
                  >
                    Suivant
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Expérience professionnelle
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Veuillez renseigner vos expériences professionnelles et
                compétences.
              </p>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPosition"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Poste actuel
                  </label>
                  <input
                    type="text"
                    id="currentPosition"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Développeur Full-Stack"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Entreprise actuelle
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Tech Solutions Inc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Secteur d&apos;activité
                  </label>
                  <select
                    id="industry"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="" disabled selected>
                      Sélectionnez un secteur
                    </option>
                    <option value="technology">Technologie</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Santé</option>
                    <option value="education">Éducation</option>
                    <option value="manufacturing">Industrie</option>
                    <option value="retail">Commerce</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Compétences clés (séparées par des virgules)
                  </label>
                  <textarea
                    id="skills"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: JavaScript, React, Node.js, SQL, TypeScript"
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab("personal")}
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveTab("motivation")}
                  >
                    Suivant
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "motivation" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Objectifs professionnels
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Expliquez-nous vos objectifs professionnels et vos attentes.
              </p>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="desiredPosition"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Poste recherché
                  </label>
                  <input
                    type="text"
                    id="desiredPosition"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Chef de Projet IT"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preferredLocations"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Lieux de travail préférés
                  </label>
                  <input
                    type="text"
                    id="preferredLocations"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Paris, Lyon, Bordeaux"
                  />
                </div>

                <div>
                  <label
                    htmlFor="motivation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Projet professionnel
                  </label>
                  <textarea
                    id="motivation"
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Décrivez votre projet professionnel, vos motivations et vos attentes..."
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab("experience")}
                  >
                    Précédent
                  </button>
                  <button type="submit" className="btn-primary">
                    Soumettre ma candidature
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
