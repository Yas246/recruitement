"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useAuth } from "@/app/contexts/AuthContext";
import { useIsMobile } from "@/app/utils/responsive";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { limit, orderBy, QueryConstraint, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Interfaces pour les types de données
interface ProgressStep {
  id: number;
  name: string;
  completed?: boolean;
  active?: boolean;
  pending?: boolean;
}

interface Message extends FirestoreDocument {
  id: string;
  sender: string;
  preview: string;
  date: string;
  unread: boolean;
  recipientId?: string;
  createdAt?: Date;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

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

        // Récupérer les messages récents
        const messageConstraints: QueryConstraint[] = [
          where("recipientId", "==", userData.id),
          orderBy("createdAt", "desc"),
          limit(3),
        ];

        const messagesResult = await firestoreService.queryDocuments<Message>(
          "messages",
          messageConstraints
        );

        if (messagesResult?.length > 0) {
          setMessages(messagesResult);
        } else {
          // Messages par défaut si aucun n'existe
          const defaultMessages = [
            {
              id: "1",
              sender: "Conseiller OMSHINA",
              preview: "Veuillez compléter votre dossier de candidature...",
              date: "Aujourd'hui, 14:30",
              unread: true,
              recipientId: userData.id,
              createdAt: new Date(),
            },
            {
              id: "2",
              sender: "Support technique",
              preview: "Votre demande a bien été prise en compte...",
              date: "Hier, 09:15",
              unread: false,
              recipientId: userData.id,
              createdAt: new Date(Date.now() - 86400000), // hier
            },
          ];

          // Créer des messages par défaut dans Firestore
          for (const message of defaultMessages) {
            await firestoreService.addDocument("messages", message);
          }

          setMessages(defaultMessages);
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

  // Utiliser les étapes de progression stockées ou par défaut
  const progressSteps =
    studentData?.progressSteps || staticData.defaultProgressSteps;
  const applicationStatus = studentData?.applicationStatus || "pending";
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

  // Message d'état basé sur le statut de la candidature
  const getStatusMessage = () => {
    switch (applicationStatus) {
      case "pending":
        return "Votre progression est en bonne voie. Pour continuer, veuillez compléter votre dossier de candidature.";
      case "submitted":
        return "Votre dossier a été soumis. Nous l'examinerons dans les plus brefs délais.";
      case "interview":
        return "Félicitations ! Votre candidature a été présélectionnée. Préparez-vous pour l'entretien.";
      case "accepted":
        return "Félicitations ! Votre candidature a été acceptée. Veuillez compléter les démarches administratives.";
      case "rejected":
        return "Nous sommes désolés, votre candidature n'a pas été retenue. N'hésitez pas à nous contacter pour plus d'informations.";
      default:
        return "Votre progression est en bonne voie. Pour continuer, veuillez compléter votre dossier de candidature.";
    }
  };

  // Fonction pour formater la date des messages
  const formatMessageDate = (date: Date | string) => {
    if (!date) return "";

    // Assurer que messageDate est un objet Date valide
    let messageDate: Date;
    try {
      // Si c'est une chaîne de caractères, tenter de la convertir en Date
      messageDate = typeof date === "string" ? new Date(date) : date;

      // Vérifier si l'objet Date est valide
      if (isNaN(messageDate.getTime())) {
        console.error("Date invalide:", date);
        return typeof date === "string" ? date : "Date inconnue";
      }
    } catch (error) {
      console.error("Erreur lors de la conversion de la date:", error);
      return typeof date === "string" ? date : "Date inconnue";
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Si c'est aujourd'hui
    if (messageDate.toDateString() === now.toDateString()) {
      return `Aujourd'hui, ${messageDate.getHours()}:${messageDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    // Si c'est hier
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Hier, ${messageDate.getHours()}:${messageDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    // Sinon, afficher la date complète
    return messageDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            Progression de votre dossier
          </h2>

          <ProgressBar
            steps={progressSteps}
            showPercentage={true}
            size={isMobile ? "small" : "medium"}
            className="mb-1"
          />

          <div className="mt-3 sm:mt-6">
            <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              {getStatusMessage()}
            </p>

            <Link
              href="/dashboard/student/application"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-full inline-flex items-center transition-colors"
            >
              Compléter ma candidature
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2"
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Messages récents */}
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Messages récents
              </h2>

              <Link
                href="/dashboard/student/messages"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm font-medium"
              >
                Voir tous
              </Link>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-2 sm:pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                          {message.sender}
                          {message.unread && (
                            <span className="ml-1.5 inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                          )}
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 sm:mt-1 truncate">
                          {message.preview}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                        {message.date ||
                          (message.createdAt
                            ? formatMessageDate(message.createdAt)
                            : "")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Aucun message récent.
                </p>
              )}
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="glass-card p-4 sm:p-6 lg:col-span-2">
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
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 sm:mt-1">
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
