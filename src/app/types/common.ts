/**
 * Types communs utilisés dans plusieurs composants de l'application
 */

/**
 * Interface pour représenter une étape dans une barre de progression
 */
export interface ProgressStep {
  id: number;
  name: string;
  completed?: boolean;
  active?: boolean;
  pending?: boolean;
}

/**
 * Types de thèmes disponibles
 */
export type ThemeType = "light" | "dark" | "system";

/**
 * Types de variantes pour des composants qui peuvent avoir plusieurs styles
 */
export type VariantType =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";
