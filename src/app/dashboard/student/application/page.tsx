"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";

// Interfaces pour les données de l'application
interface ProgressStep {
  id: number;
  name: string;
  completed?: boolean;
  active?: boolean;
  pending?: boolean;
}

interface PersonalInfo extends Record<string, unknown> {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface EducationInfo extends Record<string, unknown> {
  lastDiploma: string;
  school: string;
  targetFormation: string;
}

interface ApplicationData extends FirestoreDocument {
  personalInfo: PersonalInfo;
  educationInfo: EducationInfo;
  motivationLetter: string;
  progressSteps: ProgressStep[];
  status: "draft" | "submitted" | "reviewing" | "accepted" | "rejected";
  submittedAt?: Date;
  updatedAt: Date;
}

const formatDate = (date: Date | Timestamp | string | undefined) => {
  if (!date) return "Non soumis";

  let dateObj: Date;
  if (date instanceof Timestamp) {
    dateObj = date.toDate();
  } else if (typeof date === "string") {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return "Date invalide";
  }

  return dateObj.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function StudentApplication() {
  const { userData, user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);

  // Référence pour éviter les chargements en boucle
  const isDataFetchingRef = useRef(false);
  const isDataLoadedRef = useRef(false);

  // État local pour les formulaires
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [educationInfo, setEducationInfo] = useState<EducationInfo>({
    lastDiploma: "",
    school: "",
    targetFormation: "",
  });

  const [motivationLetter, setMotivationLetter] = useState("");

  // Étapes de progression par défaut
  const defaultProgressSteps = useCallback<() => ProgressStep[]>(
    () => [
      { id: 1, name: "Informations personnelles", completed: false },
      { id: 2, name: "Documents requis", completed: false },
      { id: 3, name: "Candidature", completed: false, active: true },
      { id: 4, name: "Entretien", pending: true },
      { id: 5, name: "Décision finale", pending: true },
    ],
    []
  );

  // Références pour éviter les re-rendus
  const toastRef = useRef(toast);
  const userDataRef = useRef(userData);

  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  // Debug: Tracer les changements d'état utilisateur
  useEffect(() => {
    console.log("DEBUG-AUTH: Changement détecté dans user ou userData");
    console.log("DEBUG-AUTH: user?.uid =", user?.uid);
    console.log("DEBUG-AUTH: userData =", userData);
  }, [user, userData]);

  // Charger les données de candidature de l'étudiant
  useEffect(() => {
    console.log("DEBUG-EFFECT: useEffect déclenché pour fetchApplicationData");
    console.log("DEBUG-EFFECT: Dépendances - user?.uid =", user?.uid);
    console.log("DEBUG-EFFECT: isDataFetchingRef =", isDataFetchingRef.current);
    console.log("DEBUG-EFFECT: isDataLoadedRef =", isDataLoadedRef.current);

    // Si une requête est déjà en cours ou si les données sont déjà chargées, on ne fait rien
    if (isDataFetchingRef.current || isDataLoadedRef.current) {
      console.log(
        "DEBUG-EFFECT: Ignorer - données déjà chargées ou en cours de chargement"
      );
      return;
    }

    // Si aucun utilisateur n'est connecté, on ne fait rien
    if (!user?.uid) {
      console.log("DEBUG-FETCH: Arrêt - user?.uid non défini");
      return;
    }

    const fetchApplicationData = async () => {
      // Marquer le début du chargement
      isDataFetchingRef.current = true;

      console.log("DEBUG-FETCH: Début de fetchApplicationData");

      try {
        setLoading(true);
        console.log(
          "DEBUG-FETCH: Recherche de l'application pour l'utilisateur",
          user.uid
        );
        // Vérifier si l'application existe déjà
        const applicationId = `application_${user.uid}`;
        const existingApplication =
          await firestoreService.getDocument<ApplicationData>(
            "studentApplications",
            applicationId
          );

        console.log(
          "DEBUG-FETCH: Application existante trouvée?",
          !!existingApplication
        );

        if (existingApplication) {
          console.log("DEBUG-FETCH: Utilisation de l'application existante");
          // Utiliser les données existantes
          setApplicationData(existingApplication);
          setPersonalInfo(existingApplication.personalInfo);
          setEducationInfo(existingApplication.educationInfo);
          setMotivationLetter(existingApplication.motivationLetter || "");
        } else {
          console.log(
            "DEBUG-FETCH: Création d'une nouvelle application avec userData",
            userData
          );
          // Créer une nouvelle candidature avec les infos de base de l'utilisateur
          // Utiliser une copie locale de userData pour éviter les références qui changent
          const userDataSnapshot = userData ? { ...userData } : null;
          console.log(
            "DEBUG-FETCH: Utilisation d'un snapshot de userData:",
            userDataSnapshot
          );

          const newApplication: ApplicationData = {
            personalInfo: {
              firstName: userDataSnapshot?.firstName || "",
              lastName: userDataSnapshot?.lastName || "",
              email: userDataSnapshot?.email || "",
              phone: userDataSnapshot?.phoneNumber || "",
            },
            educationInfo: {
              lastDiploma: "",
              school: "",
              targetFormation: "",
            },
            motivationLetter: "",
            progressSteps: defaultProgressSteps(),
            status: "draft",
            updatedAt: new Date(),
          };

          console.log(
            "DEBUG-FETCH: Tentative de création de document Firestore"
          );
          await firestoreService.createDocument<ApplicationData>(
            "studentApplications",
            applicationId,
            newApplication
          );
          console.log("DEBUG-FETCH: Document Firestore créé avec succès");

          setApplicationData(newApplication);
          setPersonalInfo(newApplication.personalInfo);
        }

        // Marquer les données comme chargées
        isDataLoadedRef.current = true;
      } catch (error) {
        console.error("DEBUG-FETCH-ERROR:", error);
        console.error("Erreur lors du chargement de la candidature:", error);
        toastRef.current.error(
          "Erreur lors du chargement de votre candidature."
        );
      } finally {
        console.log("DEBUG-FETCH: Fin de fetchApplicationData, loading=false");
        setLoading(false);
        // Marquer la fin du chargement
        isDataFetchingRef.current = false;
      }
    };

    fetchApplicationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]); // Suppression intentionnelle de `defaultProgressSteps` et `userData` des dépendances

  // Debug: Tracer les changements d'état d'application
  useEffect(() => {
    // Ne pas logger si applicationData est null (état initial)
    if (applicationData) {
      console.log("DEBUG-APP-DATA: applicationData a changé:", applicationData);
    }
  }, [applicationData]);

  // Debug: Tracer les changements d'états des formulaires
  useEffect(() => {
    console.log("DEBUG-FORM: personalInfo a changé:", personalInfo);
  }, [personalInfo]);

  useEffect(() => {
    console.log("DEBUG-FORM: educationInfo a changé:", educationInfo);
  }, [educationInfo]);

  useEffect(() => {
    console.log(
      "DEBUG-FORM: motivationLetter a changé:",
      motivationLetter.length > 100
        ? motivationLetter.substring(0, 100) + "..."
        : motivationLetter
    );
  }, [motivationLetter]);

  // Mettre à jour les étapes de progression basées sur les données
  const updateProgressSteps = () => {
    if (!applicationData) return defaultProgressSteps();

    const updatedSteps = [...applicationData.progressSteps];

    // Vérifier si les informations personnelles sont complétées
    if (
      personalInfo.firstName &&
      personalInfo.lastName &&
      personalInfo.email &&
      personalInfo.phone
    ) {
      updatedSteps[0].completed = true;
    } else {
      updatedSteps[0].completed = false;
    }

    // Le document requis est géré dans un autre onglet, nous gardons l'état actuel

    // Vérifier si les informations académiques et la lettre de motivation sont complétées
    if (
      educationInfo.lastDiploma &&
      educationInfo.school &&
      educationInfo.targetFormation &&
      motivationLetter.length > 50
    ) {
      updatedSteps[2].completed = true;
      updatedSteps[2].active = false;
      updatedSteps[3].active = true;
      updatedSteps[3].pending = false;
    } else {
      updatedSteps[2].completed = false;
      updatedSteps[2].active = true;
    }

    // Mettre à jour les étapes dans Firestore pour synchroniser avec le dashboard
    const updateFirestore = async () => {
      if (!user?.uid) return;

      try {
        await firestoreService.updateDocument("students", user.uid, {
          progressSteps: updatedSteps,
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des étapes:", error);
      }
    };

    updateFirestore();

    return updatedSteps;
  };

  // Sauvegarder les modifications
  const saveChanges = async (nextTab?: string) => {
    if (!user?.uid || !applicationData) return;

    try {
      setSaving(true);
      const applicationId = `application_${user.uid}`;
      const updatedSteps = updateProgressSteps();

      const updatedApplication = {
        ...applicationData,
        personalInfo,
        educationInfo,
        motivationLetter,
        progressSteps: updatedSteps,
        updatedAt: new Date(),
      };

      console.log("DEBUG-SAVE: Début de la sauvegarde des modifications");
      await firestoreService.updateDocument(
        "studentApplications",
        applicationId,
        updatedApplication
      );
      console.log("DEBUG-SAVE: Sauvegarde terminée avec succès");

      // Mise à jour locale des données sans déclencher le useEffect de chargement
      setApplicationData(updatedApplication as ApplicationData);

      toastRef.current.success("Vos modifications ont été enregistrées.");

      if (nextTab) {
        setActiveTab(nextTab);
      }
    } catch (error) {
      console.error("DEBUG-SAVE-ERROR:", error);
      console.error("Erreur lors de la sauvegarde:", error);
      toastRef.current.error(
        "Erreur lors de la sauvegarde de vos modifications."
      );
    } finally {
      setSaving(false);
    }
  };

  // Soumettre la candidature
  const submitApplication = async () => {
    if (!user?.uid || !applicationData) return;

    try {
      setSaving(true);
      console.log("DEBUG-SUBMIT: Début de la soumission de la candidature");

      // Log détaillé des champs manquants
      console.log("DEBUG-SUBMIT: Vérification des champs obligatoires:");
      console.log("DEBUG-SUBMIT: Informations personnelles:");
      console.log("- Prénom:", personalInfo.firstName ? "✓" : "✗");
      console.log("- Nom:", personalInfo.lastName ? "✓" : "✗");
      console.log("- Email:", personalInfo.email ? "✓" : "✗");
      console.log("- Téléphone:", personalInfo.phone ? "✓" : "✗");

      console.log("DEBUG-SUBMIT: Informations académiques:");
      console.log("- Dernier diplôme:", educationInfo.lastDiploma ? "✓" : "✗");
      console.log("- Établissement:", educationInfo.school ? "✓" : "✗");
      console.log(
        "- Formation souhaitée:",
        educationInfo.targetFormation ? "✓" : "✗"
      );

      console.log("DEBUG-SUBMIT: Lettre de motivation:");
      console.log(
        "- Longueur:",
        motivationLetter.length,
        "caractères",
        motivationLetter.length >= 50 ? "✓" : "✗"
      );

      // Vérifier que toutes les informations requises sont présentes
      if (
        !personalInfo.firstName ||
        !personalInfo.lastName ||
        !personalInfo.email ||
        !personalInfo.phone ||
        !educationInfo.lastDiploma ||
        !educationInfo.school ||
        !educationInfo.targetFormation ||
        motivationLetter.length < 50
      ) {
        console.log(
          "DEBUG-SUBMIT: Informations incomplètes, soumission annulée"
        );
        toastRef.current.error(
          "Veuillez compléter toutes les sections avant de soumettre votre candidature."
        );
        setSaving(false);
        return;
      }

      const applicationId = `application_${user.uid}`;
      const updatedSteps = updateProgressSteps();

      // Mettre à jour le statut de la candidature
      const submittedApplication = {
        ...applicationData,
        personalInfo,
        educationInfo,
        motivationLetter,
        progressSteps: updatedSteps,
        status: "submitted",
        submittedAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("DEBUG-SUBMIT: Mise à jour du document dans Firestore");
      await firestoreService.updateDocument(
        "studentApplications",
        applicationId,
        submittedApplication
      );
      console.log("DEBUG-SUBMIT: Document mis à jour avec succès");

      // Mise à jour locale sans déclencher de rechargement
      setApplicationData(submittedApplication as ApplicationData);

      toastRef.current.success("Votre candidature a été soumise avec succès!");
    } catch (error) {
      console.error("DEBUG-SUBMIT-ERROR:", error);
      console.error("Erreur lors de la soumission:", error);
      toastRef.current.error(
        "Erreur lors de la soumission de votre candidature."
      );
    } finally {
      setSaving(false);
    }
  };

  // Gestionnaires d'événements pour les formulaires
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPersonalInfo({ ...personalInfo, [id]: value });
  };

  const handleEducationInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setEducationInfo({ ...educationInfo, [id]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Ma Candidature
      </h1>

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
              activeTab === "education"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("education")}
          >
            Parcours académique
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "motivation"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("motivation")}
          >
            Lettre de motivation
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

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.firstName}
                      onChange={handlePersonalInfoChange}
                      disabled={
                        applicationData?.status === "submitted" || saving
                      }
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.lastName}
                      onChange={handlePersonalInfoChange}
                      disabled={
                        applicationData?.status === "submitted" || saving
                      }
                    />
                  </div>
                </div>

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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    disabled={applicationData?.status === "submitted" || saving}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+33 6 12 34 56 78"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    disabled={applicationData?.status === "submitted" || saving}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => saveChanges("education")}
                    disabled={applicationData?.status === "submitted" || saving}
                  >
                    {saving ? (
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
              </form>
            </div>
          )}

          {activeTab === "education" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Parcours académique
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Veuillez renseigner vos diplômes et formations.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="lastDiploma"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Dernier diplôme obtenu
                  </label>
                  <input
                    type="text"
                    id="lastDiploma"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Licence en Informatique"
                    value={educationInfo.lastDiploma}
                    onChange={handleEducationInfoChange}
                    disabled={applicationData?.status === "submitted" || saving}
                  />
                </div>

                <div>
                  <label
                    htmlFor="school"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Établissement
                  </label>
                  <input
                    type="text"
                    id="school"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Université de Paris"
                    value={educationInfo.school}
                    onChange={handleEducationInfoChange}
                    disabled={applicationData?.status === "submitted" || saving}
                  />
                </div>

                <div>
                  <label
                    htmlFor="targetFormation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Formation souhaitée
                  </label>
                  <select
                    id="targetFormation"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    value={educationInfo.targetFormation}
                    onChange={handleEducationInfoChange}
                    disabled={applicationData?.status === "submitted" || saving}
                  >
                    <option value="" disabled>
                      Sélectionnez une formation
                    </option>
                    <option value="mba">MBA International</option>
                    <option value="msc">MSc Data Science</option>
                    <option value="engineering">Génie Informatique</option>
                    <option value="marketing">Marketing Digital</option>
                  </select>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab("personal")}
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => saveChanges("motivation")}
                    disabled={applicationData?.status === "submitted" || saving}
                  >
                    {saving ? (
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
              </form>
            </div>
          )}

          {activeTab === "motivation" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Lettre de motivation
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Expliquez-nous votre projet d&apos;études et vos motivations.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="motivation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Lettre de motivation
                  </label>
                  <textarea
                    id="motivation"
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Décrivez votre projet d'études et vos motivations pour rejoindre cette formation..."
                    value={motivationLetter}
                    onChange={(e) => setMotivationLetter(e.target.value)}
                    disabled={applicationData?.status === "submitted" || saving}
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveTab("education")}
                  >
                    Précédent
                  </button>
                  {applicationData?.status === "submitted" ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                      Candidature soumise le{" "}
                      {applicationData.submittedAt && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(applicationData.submittedAt)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => saveChanges()}
                        disabled={saving}
                      >
                        {saving
                          ? "Enregistrement..."
                          : "Enregistrer le brouillon"}
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={submitApplication}
                        disabled={saving}
                      >
                        {saving ? (
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
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
