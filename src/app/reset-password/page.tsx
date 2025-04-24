"use client";

import { useToast } from "@/app/hooks/useToast";
import { authService } from "@/firebase";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function ResetPasswordPage() {
  const { theme } = useTheme();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      setIsLoading(false);
      return;
    }

    try {
      await toast.promise(authService.resetPassword(email), {
        loading: "Envoi de l'email de réinitialisation...",
        success: "Email de réinitialisation envoyé avec succès !",
        error: (err) => {
          if (err instanceof Error) {
            if (err.message.includes("auth/user-not-found")) {
              setError("Aucun compte n'est associé à cette adresse email.");
              return "Aucun compte n'est associé à cette adresse email.";
            } else if (err.message.includes("auth/invalid-email")) {
              setError("Format d'email invalide.");
              return "Format d'email invalide.";
            } else {
              setError(
                "Une erreur est survenue. Veuillez réessayer plus tard."
              );
              console.error("Erreur détaillée:", err);
              return "Une erreur est survenue. Veuillez réessayer plus tard.";
            }
          } else {
            setError("Une erreur inattendue est survenue.");
            return "Une erreur inattendue est survenue.";
          }
        },
      });

      setIsSuccess(true);
    } catch (error) {
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
            Mot de passe oublié
          </h1>

          {isSuccess ? (
            <div className="glass-card p-6 text-center">
              <div className="mb-4 text-green-600 dark:text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Email envoyé !</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Un lien de réinitialisation de mot de passe a été envoyé à{" "}
                <span className="font-medium">{email}</span>. Veuillez vérifier
                votre boîte de réception et suivre les instructions.
              </p>
              <div className="flex flex-col space-y-3">
                <Link href="/login" className="btn-primary py-2 text-center">
                  Retour à la connexion
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="btn-secondary py-2"
                >
                  Utiliser une autre adresse email
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="glass-card p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto dark:bg-gray-800/90 transition-all">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Entrez l'adresse email associée à votre compte. Nous vous
                  enverrons un lien pour réinitialiser votre mot de passe.
                </p>
                <form onSubmit={handleResetPassword} className="space-y-4">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                      placeholder="john.doe@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      "Envoyer le lien de réinitialisation"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <Link
                      href="/login"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                    >
                      Retour à la connexion
                    </Link>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
