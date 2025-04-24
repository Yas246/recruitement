import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "./config";
import { UserRole } from "./types";

// Types
export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  // Ajoutez d'autres champs au besoin
}

export interface SignInData {
  email: string;
  password: string;
}

// Helper pour convertir les données d'inscription en document Firestore
const createUserDocument = async (user: User, data: SignUpData) => {
  const userDocRef = doc(firestore, "users", user.uid);

  // Vérifier si l'utilisateur existe déjà
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return;
  }

  // Créer le document utilisateur
  const userData = {
    id: user.uid,
    email: user.email,
    firstName: data.firstName,
    lastName: data.lastName,
    displayName: `${data.firstName} ${data.lastName}`,
    role: data.role, // Utiliser directement le rôle fourni
    phoneNumber: data.phoneNumber || null,
    photoURL: user.photoURL || null,
    emailVerified: user.emailVerified,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
  };

  await setDoc(userDocRef, userData);
  return userData;
};

// Service d'authentification
export const authService = {
  // Créer un nouvel utilisateur
  signUp: async (data: SignUpData): Promise<UserCredential> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Mise à jour du profil utilisateur avec le nom et prénom
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: `${data.firstName} ${data.lastName}`,
        });

        // Stockage des informations supplémentaires dans Firestore
        await createUserDocument(userCredential.user, data);
      }

      return userCredential;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  },

  // Connecter un utilisateur existant
  signIn: async (data: SignInData): Promise<UserCredential> => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Mise à jour de la date de dernière connexion
      if (credential.user) {
        const userDocRef = doc(firestore, "users", credential.user.uid);
        await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });
      }

      return credential;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  },

  // Déconnecter l'utilisateur actuel
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  },

  // Observer les changements d'état d'authentification
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Réinitialiser le mot de passe
  resetPassword: async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      throw error;
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },
};
