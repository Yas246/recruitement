"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { Timestamp } from "firebase/firestore";
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
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolioStatus, setPortfolioStatus] = useState<
    "up_to_date" | "outdated" | "not_uploaded"
  >("not_uploaded");

  const nextSteps = [
    {
      id: 1,
      title: "Finaliser votre dossier de candidature",
      description:
        "Complétez votre dossier en renseignant toutes les informations requises et en téléchargeant les documents demandés.",
    },
    {
      id: 2,
      title: "Préparation à l'entretien",
      description:
        "Une fois votre portfolio validé, préparez-vous pour l'entretien en consultant nos conseils spécifiques aux artistes.",
    },
    {
      id: 3,
      title: "Démarches d'intégration artistique",
      description:
        "Après acceptation, nous vous accompagnerons dans votre intégration (résidence, espace de création, expositions).",
    },
  ];

  const defaultResources = [
    {
      id: "1",
      title: "Guide de l'artiste résident",
      url: "/resources/artist-guide",
      category: "guide",
    },
    {
      id: "2",
      title: "Préparation aux entretiens artistiques",
      url: "/resources/art-interview-prep",
      category: "preparation",
    },
    {
      id: "3",
      title: "Informations sur les résidences",
      url: "/resources/residency-info",
      category: "administratif",
    },
    {
      id: "4",
      title: "Liste des galeries partenaires",
      url: "/resources/gallery-partners",
      category: "partenaires",
    },
  ];

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
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          Conseils contextuels
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Conseil
              </p>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-200">
                Vérifiez vos documents avant de les soumettre pour accélérer la
                validation.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
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
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Pour un dossier complet
                </p>
                <p className="mt-1 text-sm text-green-600 dark:text-green-200">
                  Assurez-vous que tous vos documents sont à jour et lisibles
                  avant de les télécharger.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Gagnez du temps
                </p>
                <p className="mt-1 text-sm text-purple-600 dark:text-purple-200">
                  Consultez régulièrement vos notifications pour rester informé
                  de l'avancement de votre dossier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"></div>

      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Prochaines étapes */}
        <div className="glass-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Prochaines étapes
          </h2>

          <ul className="space-y-3 sm:space-y-4">
            {nextSteps.map((step) => (
              <li key={step.id} className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <span className="text-xs">{step.id}</span>
                  </div>
                </div>
                <div className="ml-2 sm:ml-3">
                  <h3 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 sm:mt-1">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Ressources utiles
          </h2>

          <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {defaultResources.map((resource) => (
              <li key={resource.id}>
                <a
                  href={resource.url}
                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
