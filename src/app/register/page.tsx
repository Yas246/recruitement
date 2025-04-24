"use client";

import AuthForm from "@/app/components/AuthForm";
import { useToast } from "@/app/hooks/useToast";
import { AuthFormData } from "@/app/types/auth";
import { UserRole } from "@/firebase/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { signUp, user, userData, userLoading } = useAuth();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Rediriger vers le dashboard si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user && userData && !userLoading) {
      // Redirection en fonction du rôle d'utilisateur
      const role = userData.role || "other";
      router.push(`/dashboard/${role}`);
    }
  }, [user, userData, userLoading, router]);

  const handleRegister = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    // Vérifier que les mots de passe correspondent
    if (data.password !== data.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      toast.error("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      // Utilisation de toast.promise pour gérer les états de la promesse
      await toast.promise(
        signUp(
          data.email,
          data.password,
          data.firstName || "",
          data.lastName || "",
          (data.userType as UserRole) || "other"
        ),
        {
          loading: "Inscription en cours...",
          success:
            "Inscription réussie ! Redirection vers votre tableau de bord...",
          error: (err) => {
            // Gestion des erreurs
            if (err instanceof Error) {
              if (err.message.includes("auth/email-already-in-use")) {
                setError("Cet email est déjà utilisé.");
                return "Cet email est déjà utilisé.";
              } else if (err.message.includes("auth/weak-password")) {
                setError(
                  "Le mot de passe est trop faible (au moins 6 caractères)."
                );
                return "Le mot de passe est trop faible (au moins 6 caractères).";
              } else if (err.message.includes("auth/invalid-email")) {
                setError("Format d'email invalide.");
                return "Format d'email invalide.";
              } else if (err.message.includes("auth/configuration-not-found")) {
                setError(
                  "Erreur de configuration Firebase. Veuillez contacter l'administrateur."
                );
                return "Erreur de configuration Firebase. Veuillez contacter l'administrateur.";
              } else {
                setError(
                  "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
                );
                console.error("Erreur d'inscription détaillée:", err);
                return "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
              }
            } else {
              setError("Une erreur inattendue est survenue.");
              return "Une erreur inattendue est survenue.";
            }
          },
        }
      );
      // La redirection sera gérée par l'effet useEffect ci-dessus
    } catch (error) {
      // Nous ne devrions pas arriver ici car toast.promise gère les erreurs,
      // mais c'est une bonne pratique de garder ce bloc catch
      console.error("Erreur inattendue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-layout ${theme}`}>
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Créer un compte
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <AuthForm
            mode="register"
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
