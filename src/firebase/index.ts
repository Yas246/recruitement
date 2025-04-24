// Firebase configuration
import { auth, firebaseApp, firestore, storage } from "./config";

// Authentication service
import { authService } from "./auth";
export type { SignInData, SignUpData } from "./auth";
export type { FirestoreDocument } from "./firestore";
// Types communs
export type { UserProfile, UserRole } from "./types";

// Firestore service
import { firestoreService } from "./firestore";

// Storage service
import { storageService } from "./storage";

// Export all services and configurations
export {
  auth,
  authService,
  firebaseApp,
  firestore,
  firestoreService,
  storage,
  storageService,
};

// Export a default object for convenient imports
const firebase = {
  auth,
  firestore,
  storage,
  authService,
  firestoreService,
  storageService,
};

export default firebase;
