"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useState } from "react";

export default function ArtistApplication() {
  const [activeTab, setActiveTab] = useState("personal");

  // Données factices pour simuler les étapes de progression
  const progressSteps = [
    { id: 1, name: "Informations personnelles", completed: true },
    { id: 2, name: "Documents requis", completed: true },
    { id: 3, name: "Portfolio", completed: false },
    { id: 4, name: "Candidature", completed: false, active: true },
    { id: 5, name: "Audition/Présentation", pending: true },
    { id: 6, name: "Décision finale", pending: true },
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
          compléter les informations de votre candidature artistique ci-dessous.
        </p>
      </div>

      <div className="glass-card p-0 overflow-hidden">
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
              activeTab === "artistic"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("artistic")}
          >
            Parcours artistique
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "project"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("project")}
          >
            Projet artistique
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
                      defaultValue="Marie"
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
                      defaultValue="Dubois"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      defaultValue="marie.dubois@exemple.com"
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
                      defaultValue="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      defaultValue="Paris"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      defaultValue="75011"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Pays
                    </label>
                    <input
                      type="text"
                      id="country"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      defaultValue="France"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nationality"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Nationalité
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="Française"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Site web personnel
                    </label>
                    <input
                      type="url"
                      id="website"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://www.votresite.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="socialMedia"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Profil Instagram
                    </label>
                    <input
                      type="text"
                      id="socialMedia"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="@votre_profil"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveTab("artistic")}
                  >
                    Suivant
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "artistic" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Parcours artistique
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Veuillez renseigner vos formations, expériences et disciplines
                artistiques.
              </p>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="artisticDisciplines"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Disciplines artistiques principales
                  </label>
                  <select
                    id="artisticDisciplines"
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    size={4}
                  >
                    <option value="visualArts">Arts visuels</option>
                    <option value="digitalArt" selected>
                      Art numérique
                    </option>
                    <option value="installation" selected>
                      Installation
                    </option>
                    <option value="photography">Photographie</option>
                    <option value="painting">Peinture</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="performance">Performance</option>
                    <option value="video">Vidéo/Film</option>
                    <option value="sound">Art sonore</option>
                    <option value="mixedMedia">Techniques mixtes</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Maintenez Ctrl (ou Cmd) enfoncé pour sélectionner plusieurs
                    disciplines
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="artisticEducation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Formation artistique
                  </label>
                  <textarea
                    id="artisticEducation"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Décrivez votre parcours de formation artistique (écoles, diplômes, ateliers, etc.)"
                    defaultValue="2018-2020: Master en Art Numérique, École Nationale Supérieure des Arts Décoratifs, Paris
2015-2018: Licence en Arts Plastiques, Université Paris 1 Panthéon-Sorbonne"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="exhibitions"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Expositions et expériences notables
                  </label>
                  <textarea
                    id="exhibitions"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Listez vos expositions, résidences, prix et autres expériences artistiques significatives"
                    defaultValue="2022: Exposition collective 'Nouveaux Médias', Galerie d'Art Contemporain, Lyon
2021: Résidence artistique, Centre d'Art Numérique, Berlin
2020: Prix Jeune Talent, Festival International d'Art Contemporain"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="technologies"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Compétences techniques
                  </label>
                  <input
                    type="text"
                    id="technologies"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Photoshop, Blender, Arduino, Processing..."
                    defaultValue="After Effects, Arduino, Blender, Processing, Max/MSP, Photoshop"
                  />
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
                    onClick={() => setActiveTab("project")}
                  >
                    Suivant
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "project" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Projet artistique
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Présentez votre projet et vos motivations pour cette candidature
                internationale.
              </p>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="programType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Type de programme souhaité
                  </label>
                  <select
                    id="programType"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="" disabled>
                      Sélectionnez un programme
                    </option>
                    <option value="residency" selected>
                      Résidence artistique
                    </option>
                    <option value="exhibition">Exposition</option>
                    <option value="commission">Commande d'œuvre</option>
                    <option value="festival">
                      Participation à un festival
                    </option>
                    <option value="exchange">
                      Programme d'échange international
                    </option>
                    <option value="grant">Bourse de création</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="preferredLocations"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Lieux/Pays préférés
                  </label>
                  <input
                    type="text"
                    id="preferredLocations"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Allemagne, Japon, Canada..."
                    defaultValue="Japon, Allemagne, Pays-Bas"
                  />
                </div>

                <div>
                  <label
                    htmlFor="projectTitle"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Titre du projet
                  </label>
                  <input
                    type="text"
                    id="projectTitle"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Titre de votre projet artistique"
                    defaultValue="Écosystèmes Numériques"
                  />
                </div>

                <div>
                  <label
                    htmlFor="projectDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description du projet
                  </label>
                  <textarea
                    id="projectDescription"
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Décrivez votre projet artistique en détail (concept, médiums, dimensions, besoins techniques, etc.)"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="motivation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Lettre de motivation
                  </label>
                  <textarea
                    id="motivation"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Expliquez vos motivations pour participer à ce programme international"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Avez-vous besoin d'un soutien technique spécifique ?
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="technicalSupport"
                        value="yes"
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Oui
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="technicalSupport"
                        value="no"
                        className="text-primary-600 focus:ring-primary-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Non
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="technicalNeeds"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Besoins techniques (si applicable)
                  </label>
                  <textarea
                    id="technicalNeeds"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Décrivez vos besoins en matériel, espace, assistance technique, etc."
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab("artistic")}
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
