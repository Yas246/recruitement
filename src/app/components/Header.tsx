"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useIsMobile } from "../utils/responsive";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`glass-header sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 shadow-md" : "py-3 sm:py-4"
      }`}
    >
      <nav
        className="container mx-auto px-4 sm:px-6"
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3"
            aria-label="OMSHINA International - Retour à l'accueil"
          >
            <span className="text-lg xs:text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 truncate">
              OMSHINA International
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-3 lg:space-x-6">
              <Link href="/services" className="nav-link text-sm lg:text-base">
                Services
              </Link>
              <Link href="/about" className="nav-link text-sm lg:text-base">
                À propos
              </Link>
              <Link href="/contact" className="nav-link text-sm lg:text-base">
                Contact
              </Link>
            </div>

            {/* Auth Buttons and Theme Toggle */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Link
                href="/login"
                className="btn-secondary text-sm lg:text-base px-3 py-1.5 lg:px-4 lg:py-2"
                aria-label="Se connecter à votre compte"
              >
                Se Connecter
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm lg:text-base px-3 py-1.5 lg:px-4 lg:py-2"
                aria-label="Créer un nouveau compte"
              >
                S&apos;inscrire
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
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
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              id="mobile-menu"
              className="md:hidden pb-4 fixed right-0 top-[52px] h-[calc(100vh-52px)] w-[85%] max-w-[300px] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-nav p-4 sm:p-6 space-y-6 h-full flex flex-col">
                <div className="space-y-4 sm:space-y-6">
                  <nav className="space-y-3 sm:space-y-4">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Navigation
                    </h3>
                    <Link
                      href="/"
                      className="block px-3 py-2 rounded-md text-sm sm:text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Accueil
                    </Link>
                    <Link
                      href="/services"
                      className="block px-3 py-2 rounded-md text-sm sm:text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Services
                    </Link>
                    <Link
                      href="/about"
                      className="block px-3 py-2 rounded-md text-sm sm:text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      À propos
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-3 py-2 rounded-md text-sm sm:text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </nav>
                </div>

                <div className="mt-auto space-y-3 sm:space-y-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Compte
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <Link
                      href="/login"
                      className="btn-secondary w-full text-center text-sm sm:text-base py-2"
                      aria-label="Se connecter à votre compte"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="btn-primary w-full text-center text-sm sm:text-base py-2"
                      aria-label="Créer un nouveau compte"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
