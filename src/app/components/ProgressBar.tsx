"use client";

import { useMemo } from "react";
import { ProgressStep } from "../types/common";

export interface ProgressBarProps {
  steps: ProgressStep[];
  variant?: "default" | "compact" | "minimal";
  showPercentage?: boolean;
  customColors?: {
    completed?: string;
    active?: string;
    pending?: string;
    default?: string;
    track?: string;
  };
  className?: string;
  showStepNumbers?: boolean;
  size?: "small" | "medium" | "large";
}

export default function ProgressBar({
  steps,
  variant = "default",
  showPercentage = false,
  customColors,
  className = "",
  showStepNumbers = true,
  size = "medium",
}: ProgressBarProps) {
  // Calculer le pourcentage de progression en fonction des étapes complétées
  const percentComplete = useMemo(() => {
    const completedSteps = steps.filter((step) => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  }, [steps]);

  // Déterminer les classes de taille en fonction du paramètre size
  const sizeClasses = useMemo(() => {
    switch (size) {
      case "small":
        return {
          step: "w-8 h-8",
          text: "text-xs",
          icon: "h-4 w-4",
          spacing: "mb-2 mt-0.5",
        };
      case "large":
        return {
          step: "w-16 h-16",
          text: "text-base",
          icon: "h-8 w-8",
          spacing: "mb-4 mt-2",
        };
      default: // medium
        return {
          step: "w-12 h-12",
          text: "text-sm",
          icon: "h-6 w-6",
          spacing: "mb-3 mt-1",
        };
    }
  }, [size]);

  // Générer des classes de couleur personnalisées ou utiliser les valeurs par défaut
  const getColorClasses = (step: ProgressStep) => {
    if (step.completed) {
      return (
        customColors?.completed ||
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-2 border-green-500 dark:border-green-400"
      );
    } else if (step.active) {
      return (
        customColors?.active ||
        "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 border-2 border-primary-500 dark:border-primary-400 ring-4 ring-primary-500/30 dark:ring-primary-400/20"
      );
    } else if (step.pending) {
      return (
        customColors?.pending ||
        "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-2 border-amber-500 dark:border-amber-400"
      );
    } else {
      return (
        customColors?.default ||
        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600"
      );
    }
  };

  // Calculer la classe pour la piste de progression (track)
  const trackClass = customColors?.track || "bg-gray-200 dark:bg-gray-700";

  return (
    <div className={`relative ${className}`}>
      {/* Affichage du pourcentage si l'option est activée */}
      {showPercentage && (
        <div className="text-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {percentComplete}% Complété
          </span>
        </div>
      )}

      {/* Piste de la barre de progression */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex" style={{ top: "53%" }}>
          <div className={`w-full h-1.5 ${trackClass}`}></div>
        </div>

        <div
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
        >
          {/* Affichage des étapes */}
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center ${
                  sizeClasses.step
                } rounded-full ${getColorClasses(step)} ${
                  sizeClasses.spacing
                } z-10 shadow-sm`}
              >
                {/* Icône ou numéro en fonction de l'état de l'étape */}
                {step.completed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={sizeClasses.icon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : step.active ? (
                  showStepNumbers ? (
                    <span className="font-bold">{step.id}</span>
                  ) : (
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                  )
                ) : step.pending ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={sizeClasses.icon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : showStepNumbers ? (
                  <span className="font-semibold">{step.id}</span>
                ) : (
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                )}
              </div>

              {/* Nom de l'étape - affiché différemment selon la variante */}
              {variant !== "minimal" && (
                <span
                  className={`${sizeClasses.text} font-medium text-center ${
                    step.active
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {step.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
