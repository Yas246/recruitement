"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import UnreadMessagesCounter from "../components/UnreadMessagesCounter";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../hooks/useToast";

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
  showUnreadCounter?: boolean;
}

const SidebarLink = ({
  href,
  children,
  icon,
  onClick,
  showUnreadCounter,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname.startsWith(`${href}/`) &&
      pathname.split("/").length === href.split("/").length + 1);

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-primary-600/20 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
          : "text-gray-700 hover:text-primary-600 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800/50"
      }`}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1">{children}</span>
      {showUnreadCounter && <UnreadMessagesCounter />}
    </Link>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { userData, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Données utilisateur
  const userDisplayName = userData
    ? `${userData.firstName} ${userData.lastName}`
    : "Utilisateur";

  // Fermer le menu mobile lorsque le chemin change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const userType = pathname.includes("/student")
    ? "student"
    : pathname.includes("/worker")
    ? "worker"
    : pathname.includes("/artist")
    ? "artist"
    : pathname.includes("/admin")
    ? "admin"
    : "student";

  const userTypeLabel = {
    student: "Étudiant",
    worker: "Travailleur",
    artist: "Artiste",
    admin: "Administrateur",
  }[userType];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Fonction de déconnexion
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Vous avez été déconnecté avec succès.");
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Une erreur est survenue lors de la déconnexion.");
    }
  };

  // Function to render links based on user type
  const renderNavLinks = (closeMenu?: () => void) => {
    const handleClose = closeMenu ? () => closeMenu() : undefined;

    return (
      <nav className="space-y-1">
        <SidebarLink
          href={`/dashboard/${userType}`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          }
          onClick={handleClose}
        >
          Tableau de bord
        </SidebarLink>

        {userType === "admin" ? (
          <>
            <SidebarLink
              href="/dashboard/admin/users"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              }
              onClick={handleClose}
            >
              Utilisateurs
            </SidebarLink>

            <SidebarLink
              href="/dashboard/admin/applications"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={handleClose}
            >
              Candidatures
            </SidebarLink>

            <SidebarLink
              href="/dashboard/admin/statistics"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              }
              onClick={handleClose}
            >
              Statistiques
            </SidebarLink>

            <SidebarLink
              href="/dashboard/admin/calendar"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={handleClose}
            >
              Calendrier
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${userType}/videocall`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              }
              onClick={handleClose}
            >
              Entretiens vidéo
            </SidebarLink>
          </>
        ) : (
          <>
            <SidebarLink
              href={`/dashboard/${userType}/application`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={handleClose}
            >
              Ma Candidature
            </SidebarLink>
            <SidebarLink
              href={`/dashboard/${userType}/documents`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={handleClose}
            >
              Mes Documents
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${userType}/calendar`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={handleClose}
            >
              Calendrier
            </SidebarLink>

            {/*  <SidebarLink
              href={`/dashboard/${userType}/messages`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
              onClick={handleClose}
              showUnreadCounter={true}
            >
              Messages
            </SidebarLink> */}

            <SidebarLink
              href={`/dashboard/${userType}/videocall`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              }
              onClick={handleClose}
            >
              Mon entretien vidéo
            </SidebarLink>
          </>
        )}
      </nav>
    );
  };

  return (
    <div
      className={`min-h-screen bg-background ${theme === "dark" ? "dark" : ""}`}
    >
      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="container py-2 sm:py-4 px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400 flex items-center space-x-2"
          >
            <span>OMSHINA</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-gray-600 dark:text-gray-300 hidden sm:inline text-sm">
              {userTypeLabel}
            </span>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
            <span className="text-gray-600 dark:text-gray-300 hidden sm:inline text-sm">
              {userDisplayName}
            </span>
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 p-1.5"
              aria-label="Se déconnecter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 12.586V9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8 flex flex-col md:flex-row">
        {/* Sidebar - Desktop */}
        <aside className="w-full md:w-64 shrink-0 hidden md:block mb-6 md:mb-0">
          <div className="glass-card p-4 sm:p-5 sticky top-20 md:top-24">
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="font-bold text-center text-base sm:text-lg text-gray-900 dark:text-white">
                {userDisplayName}
              </h2>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {userTypeLabel}
              </p>
            </div>

            {renderNavLinks()}
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden"
            onClick={closeMobileMenu}
          ></div>
        )}

        {/* Mobile sidebar */}
        <div
          className={`fixed bottom-0 left-0 right-0 top-auto z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="glass-card rounded-t-xl rounded-b-none p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Menu
              </h3>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  {userDisplayName}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {userTypeLabel}
                </p>
              </div>
            </div>

            {renderNavLinks(closeMobileMenu)}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="fixed bottom-4 right-4 md:hidden z-30">
          <button
            className="btn-primary rounded-full p-3 sm:p-4 shadow-lg"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
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

        {/* Main content */}
        <main className="flex-1 md:pl-6 w-full">{children}</main>
      </div>
    </div>
  );
}
