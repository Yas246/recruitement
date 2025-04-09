"use client";

import AuthForm from "@/app/components/AuthForm";
import { AuthFormData } from "@/app/types/auth";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleRegister = async (data: AuthFormData) => {
    // TODO: Implémenter la logique d'inscription avec Firebase
    console.log("Register data:", data);
    // Redirection temporaire vers le dashboard
    router.push("/dashboard");
  };

  return (
    <div className={`auth-layout ${theme}`}>
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Créer un compte
          </h1>
          <AuthForm mode="register" onSubmit={handleRegister} />
        </div>
      </main>
    </div>
  );
}
