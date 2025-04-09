"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useState } from "react";

export default function StudentApplication() {
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
              activeTab === "education"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("education")}
          >
            Parcours académique
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "motivation"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("motivation")}
          >
            Lettre de motivation
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveTab("education")}
                  >
                    Suivant
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "education" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Parcours académique
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Veuillez renseigner vos diplômes et formations.
              </p>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="lastDiploma"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Dernier diplôme obtenu
                  </label>
                  <input
                    type="text"
                    id="lastDiploma"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Licence en Informatique"
                  />
                </div>

                <div>
                  <label
                    htmlFor="school"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Établissement
                  </label>
                  <input
                    type="text"
                    id="school"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Université de Paris"
                  />
                </div>

                <div>
                  <label
                    htmlFor="targetFormation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Formation souhaitée
                  </label>
                  <select
                    id="targetFormation"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="" disabled selected>
                      Sélectionnez une formation
                    </option>
                    <option value="mba">MBA International</option>
                    <option value="msc">MSc Data Science</option>
                    <option value="engineering">Génie Informatique</option>
                    <option value="marketing">Marketing Digital</option>
                  </select>
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
                Lettre de motivation
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Expliquez-nous votre projet d&apos;études et vos motivations.
              </p>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="motivation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Lettre de motivation
                  </label>
                  <textarea
                    id="motivation"
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Décrivez votre projet d'études et vos motivations pour rejoindre cette formation..."
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab("education")}
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
