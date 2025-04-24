/**
 * Types communs pour l'ensemble du module Firebase
 */

/**
 * Rôles d'utilisateur disponibles dans l'application
 */
export type UserRole = "admin" | "student" | "worker" | "artist";

/**
 * Type de profil utilisateur stocké dans Firestore
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  photoURL?: string;
  phoneNumber?: string;
}
