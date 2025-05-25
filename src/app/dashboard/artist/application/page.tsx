"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";

// Types
interface ProgressStep {
  id: number;
  name: string;
  completed: boolean;
  active?: boolean;
  pending?: boolean;
}

interface PersonalInfo extends Record<string, unknown> {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface ArtisticInfo extends Record<string, unknown> {
  style?: string;
  medium?: string[];
  experience?: string;
  exhibitions?: string;
  awards?: string;
}

interface ArtistApplicationData extends FirestoreDocument {
  personalInfo: PersonalInfo;
  artisticInfo: ArtisticInfo;
  motivationLetter: string;
  progressSteps: ProgressStep[];
  status: "draft" | "submitted" | "reviewing" | "accepted" | "rejected";
  submittedAt?: Timestamp;
  updatedAt: Timestamp;
}

export default function ArtistApplication() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<
    "personal" | "artistic" | "motivation"
  >("personal");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [applicationData, setApplicationData] =
    useState<ArtistApplicationData | null>(null);
  const isDataFetchingRef = useRef(false);
  const isDataLoadedRef = useRef(false);

  // État local pour les formulaires
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: user?.displayName?.split(" ")[0] || "",
    lastName: user?.displayName?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
  });

  const [artisticInfo, setArtisticInfo] = useState<ArtisticInfo>({
    style: "",
    medium: [],
    experience: "",
    exhibitions: "",
    awards: "",
  });

  const [motivationLetter, setMotivationLetter] = useState("");

  // Étapes de progression par défaut
  const defaultProgressSteps = useMemo(
    () => [
      { id: 1, name: "Informations personnelles", completed: false },
      { id: 2, name: "Informations artistiques", completed: false },
      { id: 3, name: "Lettre de motivation", completed: false, active: true },
      { id: 4, name: "Documents", completed: false },
      { id: 5, name: "Soumission", completed: false },
    ],
    []
  );

  // Charger les données de l'application
  useEffect(() => {
    const loadApplicationData = async () => {
      if (!user?.uid || isDataFetchingRef.current || isDataLoadedRef.current) {
        return;
      }

      isDataFetchingRef.current = true;
      setIsLoading(true);

      try {
        const applicationId = `application_${user.uid}`;
        const existingApplication =
          await firestoreService.getDocument<ArtistApplicationData>(
            "artistApplications",
            applicationId
          );

        if (existingApplication) {
          setApplicationData(existingApplication);
          setPersonalInfo(existingApplication.personalInfo);
          setArtisticInfo(existingApplication.artisticInfo);
          setMotivationLetter(existingApplication.motivationLetter || "");
        } else {
          // Créer une nouvelle candidature
          const newApplication: ArtistApplicationData = {
            personalInfo: {
              firstName: user.displayName?.split(" ")[0] || "",
              lastName: user.displayName?.split(" ")[1] || "",
              email: user.email || "",
              phone: user.phoneNumber || "",
              address: "",
            },
            artisticInfo: {
              style: "",
              medium: [],
              experience: "",
              exhibitions: "",
              awards: "",
            },
            motivationLetter: "",
            progressSteps: defaultProgressSteps,
            status: "draft" as const,
            updatedAt: Timestamp.now(),
          };

          await firestoreService.createDocument<ArtistApplicationData>(
            "artistApplications",
            applicationId,
            newApplication
          );

          setApplicationData(newApplication);
          setPersonalInfo(newApplication.personalInfo);
          setArtisticInfo(newApplication.artisticInfo);
        }

        isDataLoadedRef.current = true;
      } catch (error) {
        console.error("Error loading application data:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
        isDataFetchingRef.current = false;
      }
    };

    loadApplicationData();
  }, [
    user?.uid,
    defaultProgressSteps,
    toast,
    user?.displayName,
    user?.email,
    user?.phoneNumber,
  ]);

  // Sauvegarder les changements
  const saveChanges = async (
    nextTab: "personal" | "artistic" | "motivation"
  ) => {
    if (!user?.uid || !applicationData) return;

    try {
      setIsSaving(true);

      const applicationId = `application_${user.uid}`;
      const updatedApplication = {
        ...applicationData,
        personalInfo,
        artisticInfo,
        motivationLetter,
        progressSteps: defaultProgressSteps,
        updatedAt: Timestamp.now(),
      };

      await firestoreService.updateDocument<ArtistApplicationData>(
        "artistApplications",
        applicationId,
        updatedApplication
      );

      setApplicationData(updatedApplication);
      setActiveTab(nextTab);
      toast.success("Vos modifications ont été enregistrées");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  // Soumettre la candidature
  const submitApplication = async () => {
    if (!user?.uid || !applicationData) return;

    try {
      setIsSaving(true);

      // Vérifier que toutes les informations requises sont présentes
      if (
        !personalInfo.firstName ||
        !personalInfo.lastName ||
        !personalInfo.email ||
        !personalInfo.phone ||
        !artisticInfo.style ||
        !artisticInfo.medium ||
        !artisticInfo.experience ||
        !motivationLetter
      ) {
        toast.error(
          "Veuillez compléter toutes les sections avant de soumettre votre candidature."
        );
        setIsSaving(false);
        return;
      }

      const applicationId = `application_${user.uid}`;
      const now = Timestamp.now();
      const submittedApplication: ArtistApplicationData = {
        ...applicationData,
        personalInfo,
        artisticInfo,
        motivationLetter,
        progressSteps: defaultProgressSteps,
        status: "submitted" as const,
        submittedAt: now,
        updatedAt: now,
      };

      await firestoreService.updateDocument<ArtistApplicationData>(
        "artistApplications",
        applicationId,
        submittedApplication
      );

      setApplicationData(submittedApplication);
      toast.success("Votre candidature a été soumise avec succès!");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Erreur lors de la soumission de votre candidature.");
    } finally {
      setIsSaving(false);
    }
  };

  // Gestion des changements de formulaire
  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArtisticInfoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setArtisticInfo((prev) => ({
      ...prev,
      [name]:
        name === "medium" ? value.split(",").map((item) => item.trim()) : value,
    }));
  };

  const handleMotivationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMotivationLetter(e.target.value);
  };

  // Rendu des formulaires
  const renderPersonalForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prénom *
          </label>
          <input
            type="text"
            name="firstName"
            value={personalInfo.firstName || ""}
            onChange={handlePersonalInfoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom *
          </label>
          <input
            type="text"
            name="lastName"
            value={personalInfo.lastName || ""}
            onChange={handlePersonalInfoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={personalInfo.email || ""}
            onChange={handlePersonalInfoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            name="phone"
            value={personalInfo.phone || ""}
            onChange={handlePersonalInfoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Adresse
        </label>
        <textarea
          name="address"
          value={personalInfo.address || ""}
          onChange={handlePersonalInfoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>
    </div>
  );

  const renderArtisticForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Style artistique *
        </label>
        <input
          type="text"
          name="style"
          value={artisticInfo.style || ""}
          onChange={handleArtisticInfoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Médiums utilisés *
        </label>
        <input
          type="text"
          name="medium"
          value={artisticInfo.medium?.join(",") || ""}
          onChange={handleArtisticInfoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Séparés par des virgules"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Expérience artistique *
        </label>
        <textarea
          name="experience"
          value={artisticInfo.experience || ""}
          onChange={handleArtisticInfoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Expositions
        </label>
        <textarea
          name="exhibitions"
          value={artisticInfo.exhibitions || ""}
          onChange={handleArtisticInfoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Prix et distinctions
        </label>
        <textarea
          name="awards"
          value={artisticInfo.awards || ""}
          onChange={handleArtisticInfoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
        />
      </div>
    </div>
  );

  const renderMotivationForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Lettre de motivation *
        </label>
        <textarea
          value={motivationLetter || ""}
          onChange={handleMotivationChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={10}
          required
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Candidature
        </h1>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Onglets */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "personal"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Informations personnelles
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "artistic"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("artistic")}
          >
            Parcours artistique
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "motivation"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("motivation")}
          >
            Projet artistique
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === "personal" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Informations personnelles
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Veuillez compléter vos informations personnelles ci-dessous.
              </p>
              {renderPersonalForm()}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  onClick={() => saveChanges("artistic")}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
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
                      Enregistrement...
                    </span>
                  ) : (
                    "Suivant"
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "artistic" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Parcours artistique
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Veuillez renseigner votre parcours et expérience artistique.
              </p>
              {renderArtisticForm()}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  onClick={() => setActiveTab("personal")}
                  disabled={isSaving}
                >
                  Précédent
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  onClick={() => saveChanges("motivation")}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
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
                      Enregistrement...
                    </span>
                  ) : (
                    "Suivant"
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "motivation" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Projet artistique
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Présentez votre projet artistique et vos motivations.
              </p>
              {renderMotivationForm()}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  onClick={() => setActiveTab("artistic")}
                  disabled={isSaving}
                >
                  Précédent
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  onClick={submitApplication}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
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
                      Soumission...
                    </span>
                  ) : (
                    "Soumettre ma candidature"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
