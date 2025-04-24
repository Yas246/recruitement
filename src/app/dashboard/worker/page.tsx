"use client";

import WorkerProgressBar from "@/app/components/WorkerProgressBar";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { FirestoreDocument, firestoreService } from "@/firebase";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

interface WorkerData extends FirestoreDocument {
  skills: string[];
  cvStatus: "up_to_date" | "outdated" | "not_uploaded";
  applicationProgress: ApplicationProgress;
}

interface Message extends FirestoreDocument {
  id: string;
  sender: string;
  preview: string;
  date: string;
  unread: boolean;
}

interface JobOpportunity extends FirestoreDocument {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
}

type WorkerProfile = WorkerData & FirestoreDocument;

export default function WorkerDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const [errors, setErrors] = useState<{
    profile: string | null;
    messages: string | null;
    jobs: string | null;
  }>({
    profile: null,
    messages: null,
    jobs: null,
  });

  const defaultProgressSteps = useMemo<ProgressStep[]>(
    () => [
      { id: 1, name: "Informations personnelles", completed: false },
      { id: 2, name: "Documents requis", completed: false },
      { id: 3, name: "Candidature", completed: false },
      { id: 4, name: "Entretien", completed: false },
      { id: 5, name: "Décision finale", completed: false },
    ],
    []
  );

  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>(
    []
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [cvStatus, setCvStatus] = useState<
    "up_to_date" | "outdated" | "not_uploaded"
  >("not_uploaded");

  // Charger les données du profil worker
  useEffect(() => {
    const loadWorkerData = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const workerProfile = await firestoreService.getDocument<WorkerProfile>(
          "workers",
          user.uid
        );

        if (workerProfile) {
          if (!workerProfile.applicationProgress) {
            const initialProgress: ApplicationProgress = {
              currentStep: 1,
              steps: defaultProgressSteps.map((step, index) => ({
                ...step,
                completed: index === 0,
                active: index === 1,
                pending: index > 3,
              })),
            };

            await firestoreService.updateDocument<WorkerProfile>(
              "workers",
              user.uid,
              { applicationProgress: initialProgress }
            );
          } else {
            setSkills(workerProfile.skills || []);
            setCvStatus(workerProfile.cvStatus || "not_uploaded");
          }
        } else {
          const initialData: WorkerData = {
            skills: [],
            cvStatus: "not_uploaded",
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

          await firestoreService.createDocument<WorkerProfile>(
            "workers",
            user.uid,
            initialData
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        setErrors((prev) => ({
          ...prev,
          profile: "Impossible de charger votre profil",
        }));
        toast.error("Impossible de charger votre profil");
      }

      try {
        // Charger les messages récents
        const messagesCollection = `workers/${user.uid}/messages`;
        const messages = await firestoreService.getAllDocuments<Message>(
          messagesCollection
        );
        setRecentMessages(messages || []);
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
        setErrors((prev) => ({
          ...prev,
          messages: "Impossible de charger vos messages",
        }));
        toast.error("Impossible de charger vos messages");
      }

      try {
        // Charger les opportunités d'emploi
        const jobsCollection = "job_opportunities";
        const jobs = await firestoreService.getAllDocuments<JobOpportunity>(
          jobsCollection
        );
        setJobOpportunities(jobs || []);
      } catch (error) {
        console.error("Erreur lors du chargement des opportunités:", error);
        setErrors((prev) => ({
          ...prev,
          jobs: "Impossible de charger les opportunités",
        }));
        toast.error("Impossible de charger les opportunités d'emploi");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkerData();
  }, [user?.uid, toast, defaultProgressSteps]);

  const renderLoadingOrError = (section: "profile" | "messages" | "jobs") => {
    if (isLoading) {
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
        <WorkerProgressBar showPercentage size="medium" />
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
              href="/dashboard/worker/messages"
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

        {/* Opportunités d'emploi */}
        <div className="glass-card p-4 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Opportunités d&apos;emploi recommandées
            </h2>
            <Link
              href="/dashboard/worker/jobs"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm font-medium"
            >
              Voir toutes
            </Link>
          </div>

          {renderLoadingOrError("jobs") || (
            <div className="space-y-3 sm:space-y-4">
              {jobOpportunities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  Aucune opportunité d'emploi disponible pour le moment
                </p>
              ) : (
                jobOpportunities.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                          {job.company} • {job.location}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
                          Salaire: {job.salary}
                        </p>
                      </div>
                      <div className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full mt-2 sm:mt-0">
                        {job.match}% match
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                      <button className="text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors">
                        Voir détails
                      </button>
                      <button className="text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors">
                        Postuler
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Compétences et CV */}
        <div className="glass-card p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Mon profil professionnel
          </h2>

          {renderLoadingOrError("profile") || (
            <div>
              <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-2">
                Compétences principales
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

              <div className="mb-4 sm:mb-6">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-2">
                  Statut de votre CV
                </h3>
                <div className="flex items-center">
                  <div
                    className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center ${
                      cvStatus === "up_to_date"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : cvStatus === "outdated"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="ml-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {cvStatus === "up_to_date"
                      ? "CV à jour"
                      : cvStatus === "outdated"
                      ? "CV à mettre à jour"
                      : "CV non téléchargé"}
                  </span>
                </div>
              </div>

              <Link
                href="/dashboard/worker/profile"
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
