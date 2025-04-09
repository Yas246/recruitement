"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="glass-header sticky top-0 z-50">
      <nav className="container py-4" aria-label="Navigation principale">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3"
            aria-label="OMSHINA International - Retour à l'accueil"
          >
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              OMSHINA International
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6"></div>

            {/* Auth Buttons and Theme Toggle */}
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="btn-secondary"
                aria-label="Se connecter à votre compte"
              >
                Se Connecter
              </Link>
              <Link
                href="/register"
                className="btn-primary"
                aria-label="Créer un nouveau compte"
              >
                S&apos;inscrire
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Menu principal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 pb-4">
            <div className="glass-nav p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  className="btn-secondary w-full text-center"
                  aria-label="Se connecter à votre compte"
                >
                  Se Connecter
                </Link>
                <Link
                  href="/register"
                  className="btn-primary w-full text-center"
                  aria-label="Créer un nouveau compte"
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
