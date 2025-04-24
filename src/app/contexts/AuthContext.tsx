"use client";

import {
  FirestoreDocument,
  UserRole,
  authService,
  firestoreService,
} from "@/firebase";
import { User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "../hooks/useToast";

// Interface pour les données étendues de l'utilisateur
export interface UserData extends FirestoreDocument {
  id: string;
  email: string;
  type: "admin" | "student" | "worker" | "artist";
  firstName: string;
  lastName: string;
  displayName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  photoURL?: string;
  phoneNumber?: string;
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Date
    | unknown[]
    | Record<string, unknown>;
}

// Type de l'utilisateur étendu avec les informations de Firestore
export interface UserExtended extends User {
  userData?: UserData;
}

// Configuration des routes protégées et des redirections
const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register", "/reset-password"];
const DEFAULT_REDIRECT = "/";
const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  student: "/dashboard/student",
  worker: "/dashboard/worker",
  artist: "/dashboard/artist",
};

// Type du contexte d'authentification
interface AuthContextType {
  user: UserExtended | null;
  userData: UserData | null;
  userLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  redirectToDashboard: () => void;
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  userLoading: true,
  userError: null,
  isAdmin: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
  redirectToDashboard: () => {},
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserExtended | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  // Vérifier si l'utilisateur est admin
  const isAdmin = userData?.role === "admin";

  // Rediriger vers le tableau de bord approprié selon le rôle
  const redirectToDashboard = useCallback(() => {
    if (userData && userData.role) {
      const redirectUrl = ROLE_REDIRECTS[userData.role];
      router.push(redirectUrl);
    } else if (user) {
      // Si l'utilisateur est connecté mais que ses données ne sont pas encore chargées,
      // on le redirige vers le dashboard par défaut
      router.push(DEFAULT_REDIRECT);
    } else {
      // Si aucun utilisateur n'est connecté, on le redirige vers la page de connexion
      router.push("/login");
    }
  }, [userData, user, router]);

  // Charger les informations complètes de l'utilisateur depuis Firestore
  const loadUserData = useCallback(
    async (user: User) => {
      console.log("DEBUG-AUTH-CONTEXT: loadUserData appelé pour", user.uid);
      try {
        const userData = await firestoreService.getDocument<UserData>(
          "users",
          user.uid
        );

        if (userData) {
          console.log(
            "DEBUG-AUTH-CONTEXT: userData trouvé dans Firestore:",
            userData.id
          );
          // Mettre à jour les données utilisateur
          setUserData(userData);

          // Étendre l'objet utilisateur avec les données Firestore
          const extendedUser: UserExtended = user;
          extendedUser.userData = userData;
          setUser(extendedUser);

          // Rediriger vers le dashboard approprié
          const redirectUrl = ROLE_REDIRECTS[userData.role];
          router.push(redirectUrl);
        } else {
          console.log(
            "DEBUG-AUTH-CONTEXT: Aucun userData trouvé dans Firestore"
          );
          setUser(user);
          setUserData(null);
          router.push(DEFAULT_REDIRECT);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
        setUser(user);
        setUserData(null);
        router.push(DEFAULT_REDIRECT);
      }
    },
    [router]
  );

  // Observer les changements d'état d'authentification
  useEffect(() => {
    console.log(
      "DEBUG-AUTH-CONTEXT: Initialisation de l'observateur onAuthStateChanged"
    );
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      console.log(
        "DEBUG-AUTH-CONTEXT: Changement d'état d'authentification détecté:",
        !!authUser
      );
      setUserLoading(true);
      try {
        if (authUser) {
          // L'utilisateur est connecté, charger ses informations supplémentaires
          console.log(
            "DEBUG-AUTH-CONTEXT: Utilisateur connecté, chargement des données supplementaires"
          );
          await loadUserData(authUser);
        } else {
          // L'utilisateur n'est pas connecté
          console.log(
            "DEBUG-AUTH-CONTEXT: Utilisateur non connecté, réinitialisation de l'état"
          );
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setUserError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setUserLoading(false);
        setInitialCheckDone(true);
        console.log(
          "DEBUG-AUTH-CONTEXT: Fin du traitement du changement d'authentification"
        );
      }
    });

    // Nettoyer l'abonnement à la désinscription
    return () => {
      console.log(
        "DEBUG-AUTH-CONTEXT: Désinscription de l'observateur onAuthStateChanged"
      );
      unsubscribe();
    };
  }, [loadUserData]);

  // Gérer les redirections basées sur l'état d'authentification
  useEffect(() => {
    // Attendre que la vérification initiale soit terminée
    if (!initialCheckDone) return;

    // Si l'utilisateur essaie d'accéder à une route protégée sans être connecté
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname?.startsWith(route)
    );

    if (isProtectedRoute && !user && !userLoading) {
      // Rediriger vers la page de connexion
      router.push("/login");
      toast.warning("Veuillez vous connecter pour accéder à cette page");
      return;
    }

    // Si l'utilisateur est connecté et essaie d'accéder à un dashboard qui ne correspond pas à son rôle
    if (
      pathname?.startsWith("/dashboard/") &&
      user &&
      userData &&
      !userLoading
    ) {
      const currentRole = userData.role;
      const accessingRole = pathname.split("/")[2]; // Extraire le rôle de l'URL (/dashboard/[role])

      // Si l'utilisateur tente d'accéder à un dashboard qui n'est pas le sien, le rediriger vers son propre dashboard
      if (accessingRole !== currentRole && accessingRole !== "") {
        const redirectUrl = ROLE_REDIRECTS[currentRole];
        router.push(redirectUrl);
        toast.warning(
          `Vous n'avez pas accès à ce tableau de bord. Redirection vers votre espace personnel.`
        );
        return;
      }
    }

    // Si l'utilisateur est connecté et essaie d'accéder aux pages d'authentification
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

    if (isAuthRoute && user && !userLoading) {
      // Rediriger vers le tableau de bord approprié
      redirectToDashboard();
    }
  }, [
    user,
    userData,
    userLoading,
    pathname,
    router,
    redirectToDashboard,
    initialCheckDone,
    toast,
  ]);

  // Fonction d'inscription
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole
  ) => {
    setUserLoading(true);
    try {
      const result = await authService.signUp({
        email,
        password,
        firstName,
        lastName,
        role,
        phoneNumber: "", // Valeur par défaut vide
      });

      // Attendre que les données soient complètement enregistrées
      if (result.user) {
        // Attendre un court instant pour s'assurer que les données Firestore sont enregistrées
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await loadUserData(result.user);

        // Rediriger explicitement vers le bon dashboard
        const redirectUrl = ROLE_REDIRECTS[role];
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setUserError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setUserLoading(false);
    }
  };

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    setUserLoading(true);
    try {
      await authService.signIn({ email, password });
      // La redirection se fera automatiquement via l'écouteur onAuthStateChanged et l'effet useEffect
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setUserError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setUserLoading(false);
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      await authService.signOut();
      // La redirection est maintenant gérée par l'appelant
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setUserError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  // Fonction de réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      setUserError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!user) {
      throw new Error("Aucun utilisateur connecté");
    }

    try {
      // Mettre à jour les données utilisateur dans Firestore
      await firestoreService.updateDocument<UserData>("users", user.uid, {
        ...data,
        updatedAt: new Date(),
      });

      // Recharger les données utilisateur
      await loadUserData(user);

      return;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  };

  // Valeur du contexte à fournir
  const value = {
    user,
    userData,
    userLoading,
    userError,
    isAdmin,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
    redirectToDashboard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
