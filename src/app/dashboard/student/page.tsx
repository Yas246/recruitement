"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { useEffect, useMemo, useState } from "react";

// Interfaces pour les types de données
interface ProgressStep {
  id: number;
  name: string;
  completed?: boolean;
  active?: boolean;
  pending?: boolean;
}

interface NextStep {
  id: number;
  title: string;
  description: string;
}

interface Resource extends FirestoreDocument {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
}

interface StudentData extends FirestoreDocument {
  applicationStatus?: string;
  progressSteps?: ProgressStep[];
  documents?: { id: string; name: string; uploaded: boolean }[];
  nextSteps?: NextStep[];
}

export default function StudentDashboard() {
  const { userData, user } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Données statiques dans useMemo
  const staticData = useMemo(
    () => ({
      defaultProgressSteps: [
        { id: 1, name: "Informations personnelles", completed: true },
        { id: 2, name: "Documents requis", completed: false },
        { id: 3, name: "Candidature", completed: false, active: true },
        { id: 4, name: "Entretien", pending: true },
        { id: 5, name: "Décision finale", pending: true },
      ],
      defaultResources: [
        {
          id: "1",
          title: "Guide de l'étudiant international",
          url: "/resources/student-guide",
          category: "guide",
        },
        {
          id: "2",
          title: "Préparation aux entretiens",
          url: "/resources/interview-prep",
          category: "preparation",
        },
        {
          id: "3",
          title: "Informations sur les visas",
          url: "/resources/visa-info",
          category: "administratif",
        },
        {
          id: "4",
          title: "Liste des partenaires universitaires",
          url: "/resources/university-partners",
          category: "partenaires",
        },
      ],
    }),
    []
  );

  useEffect(() => {
    const loadStudentData = async () => {
      if (!user?.uid || !userData?.id) {
        setLoading(false);
        return;
      }

      try {
        const studentDoc = await firestoreService.getDocument<StudentData>(
          "students",
          user.uid
        );

        if (studentDoc) {
          setStudentData({
            ...studentDoc,
            progressSteps:
              studentDoc.progressSteps || staticData.defaultProgressSteps,
          });
        } else {
          // Si aucun document n'existe, créer un nouveau avec les étapes par défaut
          const newStudentData: StudentData = {
            progressSteps: staticData.defaultProgressSteps,
            applicationStatus: "draft",
          };
          await firestoreService.createDocument(
            "students",
            user.uid,
            newStudentData
          );
          setStudentData(newStudentData);
        }

        // Récupérer les ressources disponibles
        const resourcesResult =
          await firestoreService.getAllDocuments<Resource>("resources");

        if (resourcesResult?.length > 0) {
          setResources(resourcesResult);
        } else {
          // Ajouter des ressources par défaut si aucune n'existe
          for (const resource of staticData.defaultResources) {
            await firestoreService.addDocument("resources", resource);
          }
          setResources(staticData.defaultResources);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données étudiant:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [user?.uid, userData?.id, staticData]);

  const nextSteps = studentData?.nextSteps || [
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
        "Une fois votre dossier validé, préparez-vous pour l'entretien en consultant nos conseils et ressources disponibles.",
    },
    {
      id: 3,
      title: "Démarches administratives",
      description:
        "Après acceptation, nous vous accompagnerons dans les démarches administratives (visa, logement, etc.).",
    },
  ];

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Progression */}
        <div className="glass-card p-4 sm:p-6">
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
                  Vérifiez vos documents avant de les soumettre pour accélérer
                  la validation.
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
                    Consultez régulièrement vos notifications pour rester
                    informé de l'avancement de votre dossier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

          {/* Ressources utiles */}
          <div className="glass-card p-4 sm:p-6 lg:col-span-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Ressources utiles
            </h2>

            <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {resources.map((resource) => (
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
    </div>
  );
}
