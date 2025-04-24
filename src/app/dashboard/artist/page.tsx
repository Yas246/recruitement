"use client";

import ArtistProgressBar from "@/app/components/ArtistProgressBar";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

// Types pour les données
interface ProgressStep {
  id: number;
  name: string;
  completed: boolean;
  active?: boolean;
  pending?: boolean;
}

interface ApplicationProgress extends Record<string, unknown> {
  currentStep: number;
  steps: ProgressStep[];
}

interface ArtistData extends FirestoreDocument {
  skills: string[];
  portfolioStatus: "up_to_date" | "outdated" | "not_uploaded";
  applicationProgress: ApplicationProgress;
  artworks?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    createdAt: string;
  }[];
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | Timestamp
    | unknown[]
    | Record<string, unknown>
    | null
    | undefined;
}

interface Message {
  id: string;
  sender: string;
  preview: string;
  date: string;
  unread: boolean;
}

interface Exhibition {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "ongoing" | "past";
  description: string;
}

type ArtistProfile = ArtistData & FirestoreDocument;

export default function ArtistDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    profile: true,
    messages: true,
    exhibitions: true,
  });
  const [errors, setErrors] = useState<{
    profile: string | null;
    messages: string | null;
    exhibitions: string | null;
  }>({
    profile: null,
    messages: null,
    exhibitions: null,
  });

  const defaultProgressSteps = useMemo(
    (): ProgressStep[] => [
      { id: 1, name: "Informations personnelles", completed: false },
      { id: 2, name: "Portfolio", completed: false },
      { id: 3, name: "Candidature", completed: false },
      { id: 4, name: "Entretien", completed: false },
      { id: 5, name: "Décision finale", completed: false },
    ],
    []
  ); // Empty dependency array since this never changes

  const [, setProgressSteps] = useState<ProgressStep[]>(defaultProgressSteps);
  const [recentMessages] = useState<Message[]>([]);
  const [upcomingExhibitions] = useState<Exhibition[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolioStatus, setPortfolioStatus] = useState<
    "up_to_date" | "outdated" | "not_uploaded"
  >("not_uploaded");

  // Références pour suivre l'état du chargement
  const isDataFetchingRef = useRef(false);
  const isDataLoadedRef = useRef(false);

  // Charger les données du profil artiste
  useEffect(() => {
    const loadArtistData = async () => {
      if (!user?.uid || isDataFetchingRef.current || isDataLoadedRef.current) {
        return;
      }

      isDataFetchingRef.current = true;
      setIsLoading(true);

      try {
        const artistProfile = await firestoreService.getDocument<ArtistProfile>(
          "artists",
          user.uid
        );

        if (artistProfile) {
          if (!artistProfile.applicationProgress) {
            const initialProgress: ApplicationProgress = {
              currentStep: 1,
              steps: defaultProgressSteps.map((step, index) => ({
                ...step,
                completed: index === 0,
                active: index === 1,
                pending: index > 3,
              })),
            };

            await firestoreService.updateDocument<ArtistProfile>(
              "artists",
              user.uid,
              { applicationProgress: initialProgress }
            );

            setProgressSteps(initialProgress.steps);
          } else {
            setProgressSteps(artistProfile.applicationProgress.steps);
          }

          setSkills(artistProfile.skills || []);
          setPortfolioStatus(artistProfile.portfolioStatus || "not_uploaded");
          isDataLoadedRef.current = true;
        } else {
          const initialData: ArtistData = {
            skills: [],
            portfolioStatus: "not_uploaded",
            applicationProgress: {
              currentStep: 1,
              steps: defaultProgressSteps.map((step, index) => ({
                ...step,
                completed: index === 0,
                active: index === 1,
                pending: index > 3,
              })),
            },
          };

          await firestoreService.createDocument<ArtistProfile>(
            "artists",
            user.uid,
            initialData
          );

          setProgressSteps(initialData.applicationProgress.steps);
          isDataLoadedRef.current = true;
        }

        setLoadingStates((prev) => ({ ...prev, profile: false }));
      } catch (error) {
        console.error("Error loading artist data:", error);
        setErrors((prev) => ({
          ...prev,
          profile: "Erreur lors du chargement du profil",
        }));
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
        isDataFetchingRef.current = false;
      }
    };

    loadArtistData();
  }, [user?.uid, defaultProgressSteps, toast]); // Dépendance uniquement sur user.uid

  const renderLoadingOrError = (
    section: "profile" | "messages" | "exhibitions"
  ) => {
    if (loadingStates[section]) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    if (errors[section]) {
      return (
        <div className="text-center p-8">
          <p className="text-red-500 dark:text-red-400">{errors[section]}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Progression de votre dossier
        </h2>
        <ArtistProgressBar showPercentage size="medium" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Suivez l'avancement de votre candidature et complétez les étapes
          requises.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Messages récents */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Messages récents
            </h2>
            <Link
              href="/dashboard/artist/messages"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm font-medium"
            >
              Voir tous
            </Link>
          </div>

          {renderLoadingOrError("messages") || (
            <div className="space-y-3 sm:space-y-4">
              {recentMessages.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  Aucun message récent
                </p>
              ) : (
                recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                          {message.sender}
                          {message.unread && (
                            <span className="ml-2 inline-block w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                          )}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {message.preview}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">
                        {message.date}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Expositions à venir */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Expositions à venir
            </h2>
            <Link
              href="/dashboard/artist/exhibitions"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm font-medium"
            >
              Voir toutes
            </Link>
          </div>

          {renderLoadingOrError("exhibitions") || (
            <div className="space-y-3 sm:space-y-4">
              {upcomingExhibitions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  Aucune exposition à venir
                </p>
              ) : (
                upcomingExhibitions.map((exhibition) => (
                  <div
                    key={exhibition.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-0 last:pb-0"
                  >
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      {exhibition.title}
                    </h3>
                    <div className="mt-1 flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {exhibition.date}
                    </div>
                    <div className="mt-1 flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {exhibition.location}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Compétences et Portfolio */}
        <div className="glass-card p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Mon profil artistique
          </h2>

          {renderLoadingOrError("profile") || (
            <div>
              <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-2">
                Compétences artistiques
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                {skills.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Aucune compétence ajoutée
                  </p>
                ) : (
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-xs sm:text-sm"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>

              <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-2">
                État du portfolio
              </h3>
              <div className="flex items-center mb-4">
                <div
                  className={`h-2.5 w-2.5 rounded-full mr-2 ${
                    portfolioStatus === "up_to_date"
                      ? "bg-green-500"
                      : portfolioStatus === "outdated"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {portfolioStatus === "up_to_date"
                    ? "À jour"
                    : portfolioStatus === "outdated"
                    ? "À mettre à jour"
                    : "Non téléversé"}
                </span>
              </div>

              <Link
                href="/dashboard/artist/profile"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-xs sm:text-sm flex items-center"
              >
                Modifier mon profil
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-4 sm:w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
