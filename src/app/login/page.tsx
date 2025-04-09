"use client";

import AuthForm from "@/app/components/AuthForm";
import { AuthFormData } from "@/app/types/auth";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogin = async (data: AuthFormData) => {
    // TODO: Implémenter la logique de connexion avec Firebase
    console.log("Login data:", data);
    // Redirection temporaire vers le dashboard
    router.push("/dashboard");
  };

  return (
    <div className={`auth-layout ${theme}`}>
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Connexion
          </h1>
          <AuthForm mode="login" onSubmit={handleLogin} />
        </div>
      </main>
    </div>
  );
}
