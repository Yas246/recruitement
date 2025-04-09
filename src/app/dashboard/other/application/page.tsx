"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useState } from "react";

export default function OtherApplication() {
  // Active tab for the application form
  const [activeTab, setActiveTab] = useState<
    "personal" | "project" | "motivation"
  >("personal");

  // Progress steps
  const progressSteps = [
    {
      id: 1,
      name: "Informations personnelles",
      completed: true,
    },
    {
      id: 2,
      name: "Documents requis",
      completed: true,
    },
    {
      id: 3,
      name: "Candidature",
      completed: false,
      active: true,
    },
    {
      id: 4,
      name: "Entretien",
      pending: false,
    },
    {
      id: 5,
      name: "Décision finale",
      pending: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Ma Candidature
      </h1>

      {/* Progress bar */}
      <div className="glass-card p-6 mb-8">
        <ProgressBar steps={progressSteps} />
      </div>

      {/* Application Form */}
      <div className="glass-card overflow-hidden">
        {/* Tabs */}
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
              activeTab === "project"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("project")}
          >
            Projet
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "motivation"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("motivation")}
          >
            Motivation
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Informations personnelles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    name="firstName"
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
                    name="lastName"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="Doe"
                  />
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
                    name="email"
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
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="1990-01-01"
                  />
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
                    name="nationality"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="Française"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currentAddress"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Adresse actuelle
                  </label>
                  <input
                    type="text"
                    id="currentAddress"
                    name="currentAddress"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="123 rue Example, 75000 Paris"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currentStatus"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Situation actuelle
                  </label>
                  <select
                    id="currentStatus"
                    name="currentStatus"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="employed"
                  >
                    <option value="employed">
                      En activité professionnelle
                    </option>
                    <option value="student">Étudiant</option>
                    <option value="freelance">Indépendant / Freelance</option>
                    <option value="unemployed">
                      En recherche d&apos;emploi
                    </option>
                    <option value="retired">Retraité</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab("project")}
                >
                  Suivant: Projet
                </button>
              </div>
            </div>
          )}

          {/* Project Tab */}
          {activeTab === "project" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Projet
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Type de projet
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="professional"
                  >
                    <option value="professional">Projet professionnel</option>
                    <option value="educational">Projet éducatif</option>
                    <option value="cultural">Projet culturel</option>
                    <option value="entrepreneurial">
                      Projet entrepreneurial
                    </option>
                    <option value="relocation">Projet de relocalisation</option>
                    <option value="other">Autre type de projet</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="destinationCountry"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Pays de destination souhaité
                  </label>
                  <select
                    id="destinationCountry"
                    name="destinationCountry"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="canada"
                  >
                    <option value="canada">Canada</option>
                    <option value="australia">Australie</option>
                    <option value="uk">Royaume-Uni</option>
                    <option value="usa">États-Unis</option>
                    <option value="germany">Allemagne</option>
                    <option value="switzerland">Suisse</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="alternativeDestinations"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Destinations alternatives (optionnel)
                  </label>
                  <input
                    type="text"
                    id="alternativeDestinations"
                    name="alternativeDestinations"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Suède, Norvège, Finlande"
                  />
                </div>

                <div>
                  <label
                    htmlFor="projectDuration"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Durée envisagée
                  </label>
                  <select
                    id="projectDuration"
                    name="projectDuration"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="1-2_years"
                  >
                    <option value="less_than_6months">Moins de 6 mois</option>
                    <option value="6-12_months">6 à 12 mois</option>
                    <option value="1-2_years">1 à 2 ans</option>
                    <option value="2-5_years">2 à 5 ans</option>
                    <option value="permanent">Installation permanente</option>
                    <option value="undecided">Indécis</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="projectDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description détaillée du projet
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="Je souhaite m'établir au Canada pour y développer mon activité professionnelle dans le domaine de la consultation en développement durable. Mon objectif est de travailler avec des entreprises locales pour améliorer leur impact environnemental tout en maintenant leur rentabilité."
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="specialNeeds"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Besoins spécifiques (optionnel)
                  </label>
                  <textarea
                    id="specialNeeds"
                    name="specialNeeds"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Précisez ici si vous avez des besoins spécifiques (logement, accompagnement familial, etc.)"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  className="btn-secondary"
                  onClick={() => setActiveTab("personal")}
                >
                  Précédent: Informations personnelles
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab("motivation")}
                >
                  Suivant: Motivation
                </button>
              </div>
            </div>
          )}

          {/* Motivation Tab */}
          {activeTab === "motivation" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Motivation
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="motivationLetter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Lettre de motivation
                  </label>
                  <textarea
                    id="motivationLetter"
                    name="motivationLetter"
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="Madame, Monsieur,

Je me permets de vous adresser ma candidature pour un accompagnement dans mon projet d'expatriation au Canada. Passionné par le développement durable et fort d'une expérience de 5 ans dans ce domaine en France, je souhaite aujourd'hui donner une dimension internationale à ma carrière.

Le Canada, avec sa politique ambitieuse en matière d'environnement et son engagement pour la transition écologique, représente pour moi l'opportunité idéale de contribuer à des projets innovants tout en enrichissant mon expérience professionnelle.

Je suis particulièrement intéressé par la possibilité de bénéficier de votre expertise pour naviguer dans les démarches administratives, établir un réseau professionnel et m'intégrer efficacement dans ce nouveau contexte.

Je reste à votre disposition pour échanger plus en détail sur mon projet et vous remercie par avance de l'attention que vous porterez à ma demande.

Cordialement,
John Doe"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="objectives"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Objectifs personnels et professionnels
                  </label>
                  <textarea
                    id="objectives"
                    name="objectives"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    defaultValue="- Développer mon expertise dans le domaine du développement durable à l'international
- Créer un réseau professionnel au Canada
- Acquérir une expérience significative dans un contexte multiculturel
- Améliorer mes compétences linguistiques en anglais professionnel
- À terme, établir ma propre entreprise de consultation environnementale"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="additionalInformation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Informations complémentaires (optionnel)
                  </label>
                  <textarea
                    id="additionalInformation"
                    name="additionalInformation"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ajoutez ici toute information complémentaire pertinente pour votre candidature"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  className="btn-secondary"
                  onClick={() => setActiveTab("project")}
                >
                  Précédent: Projet
                </button>
                <button className="btn-primary">
                  Soumettre ma candidature
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
