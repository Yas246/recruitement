"use client";

import { useState } from "react";
import { ProgressStep } from "../types/common";
import ProgressBar from "./ProgressBar";

// Exemples d'étapes pour les différentes barres de progression
const defaultSteps: ProgressStep[] = [
  { id: 1, name: "Informations personnelles", completed: true },
  { id: 2, name: "Documents requis", completed: false, active: true },
  { id: 3, name: "Candidature", completed: false },
  { id: 4, name: "Entretien", pending: true },
  { id: 5, name: "Décision finale", pending: true },
];

const compactSteps: ProgressStep[] = [
  { id: 1, name: "Étape 1", completed: true },
  { id: 2, name: "Étape 2", completed: true },
  { id: 3, name: "Étape 3", active: true },
  { id: 4, name: "Étape 4", pending: true },
];

export default function ProgressBarExample() {
  const [customSteps, setCustomSteps] = useState<ProgressStep[]>([
    { id: 1, name: "Étape 1", completed: true },
    { id: 2, name: "Étape 2", completed: false },
    { id: 3, name: "Étape 3", completed: false },
  ]);

  // Fonction pour faire avancer la progression dans l'exemple interactif
  const advanceProgress = () => {
    setCustomSteps((prevSteps) => {
      const incompleteIndex = prevSteps.findIndex((step) => !step.completed);
      if (incompleteIndex === -1) return prevSteps; // Toutes les étapes sont complétées

      const newSteps = [...prevSteps];
      newSteps[incompleteIndex] = {
        ...newSteps[incompleteIndex],
        completed: true,
      };

      // Mettre à jour le statut "active" pour la prochaine étape
      if (incompleteIndex < newSteps.length - 1) {
        newSteps[incompleteIndex + 1] = {
          ...newSteps[incompleteIndex + 1],
          active: true,
        };
      }

      return newSteps;
    });
  };

  // Fonction pour réinitialiser la progression dans l'exemple interactif
  const resetProgress = () => {
    setCustomSteps([
      { id: 1, name: "Étape 1", completed: true },
      { id: 2, name: "Étape 2", completed: false },
      { id: 3, name: "Étape 3", completed: false },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Barre de progression standard
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Affiche une barre de progression avec des étapes numérotées et des
          noms d'étape.
        </p>
        <div className="glass-card p-6">
          <ProgressBar steps={defaultSteps} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Variantes de taille</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          La barre de progression peut être affichée en différentes tailles.
        </p>
        <div className="space-y-10">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Petite</h3>
            <ProgressBar steps={compactSteps} size="small" />
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Moyenne (par défaut)</h3>
            <ProgressBar steps={compactSteps} size="medium" />
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Grande</h3>
            <ProgressBar steps={compactSteps} size="large" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Avec pourcentage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Affiche un pourcentage de complétion au-dessus de la barre.
        </p>
        <div className="glass-card p-6">
          <ProgressBar steps={defaultSteps} showPercentage />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Variante minimale</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Affiche uniquement les étapes sans les noms, pour un affichage plus
          compact.
        </p>
        <div className="glass-card p-6">
          <ProgressBar steps={compactSteps} variant="minimal" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Couleurs personnalisées</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Vous pouvez personnaliser les couleurs des différentes étapes.
        </p>
        <div className="glass-card p-6">
          <ProgressBar
            steps={compactSteps}
            customColors={{
              completed:
                "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-400",
              active:
                "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 border-2 border-pink-500 dark:border-pink-400 ring-4 ring-pink-500/30 dark:ring-pink-400/20",
              pending:
                "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-2 border-purple-500 dark:border-purple-400",
              track: "bg-gray-100 dark:bg-gray-800",
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Exemple interactif</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Avancez dans la progression pour voir comment la barre évolue.
        </p>
        <div className="glass-card p-6">
          <ProgressBar steps={customSteps} showPercentage />
          <div className="mt-8 flex space-x-4">
            <button
              onClick={advanceProgress}
              className="btn-primary px-4 py-2"
              disabled={customSteps.every((step) => step.completed)}
            >
              Avancer
            </button>
            <button onClick={resetProgress} className="btn-secondary px-4 py-2">
              Réinitialiser
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
