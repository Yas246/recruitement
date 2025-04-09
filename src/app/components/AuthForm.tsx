"use client";

import { AuthFormData } from "@/app/types/auth";
import Link from "next/link";
import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: AuthFormData) => void;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userType: "student", // student, worker, artist
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (mode === "register") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword =
          "La confirmation du mot de passe est requise";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }

      if (!formData.firstName) {
        newErrors.firstName = "Le prénom est requis";
      }

      if (!formData.lastName) {
        newErrors.lastName = "Le nom est requis";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="glass-card p-8 w-full max-w-md mx-auto dark:bg-gray-800/90">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {mode === "login" ? "Se connecter" : "Créer un compte"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Type de compte
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="student">Étudiant</option>
                <option value="worker">Travailleur</option>
                <option value="artist">Artiste</option>
              </select>
            </div>
          </>
        )}

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
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {mode === "register" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full btn-primary py-3 dark:bg-primary-600"
        >
          {mode === "login" ? "Se connecter" : "S'inscrire"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Se connecter
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
