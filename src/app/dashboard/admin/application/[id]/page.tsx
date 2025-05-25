"use client";

import AdminRoute from "@/app/components/AdminRoute";
import { ProgressStep } from "@/app/types/common";
import { FirestoreDocument, firestoreService } from "@/firebase";
import { serverTimestamp, Timestamp, where } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface FormattedApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  phone?: string;
  type: "student" | "worker" | "artist";
  status: "draft" | "submitted" | "reviewing" | "accepted" | "rejected";
  submissionDate: Timestamp;
  program?: string;
  motivation?: string;
  position?: string;
  portfolio?: string;
  experience?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  educationInfo?: {
    lastDiploma: string;
    school: string;
    targetFormation: string;
  };
  professionalInfo?: {
    experience: string;
    skills: string[];
    desiredPosition: string;
    availability: string;
  };
  motivationLetter: string;
  progressSteps: ProgressStep[];
  submittedAt?: Timestamp;
  updatedAt: Timestamp;
  notes?: string;
  skills?: string[];
  languages?: Array<{ language: string; level: string }>;
  education?: Array<{ degree: string; institution: string; year: string }>;
  documents?: Array<{ type: string; url: string }>;
}

interface Application extends FirestoreDocument {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  educationInfo?: {
    lastDiploma: string;
    school: string;
    targetFormation: string;
  };
  professionalInfo?: {
    experience: string;
    skills: string[];
    desiredPosition: string;
    availability: string;
  };
  artisticInfo?: {
    style: string;
    medium: string[];
    experience: string;
    exhibitions: string;
    awards: string;
  };
  motivationLetter: string;
  progressSteps: ProgressStep[];
  status: "draft" | "submitted" | "reviewing" | "accepted" | "rejected";
  submittedAt?: Timestamp;
  updatedAt: Timestamp;
  notes?: string;
}

// Récupérer les documents d'identité du candidat
interface UserDocuments extends FirestoreDocument {
  id_card?: string;
  passport?: string;
  residence_permit?: string;
  cv?: string;
  diploma?: string;
  other_documents?: Array<{ name: string; url: string }>;
  userId?: string;
  id?: string;
}

interface FirestoreDocumentData extends FirestoreDocument {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "not_uploaded";
  uploadDate?: string;
  fileSize?: string;
  feedback?: string;
  required: boolean;
  fileUrl?: string;
}

interface ArtistDocumentsDocument extends FirestoreDocument {
  documents: FirestoreDocumentData[];
  progressSteps?: {
    id: number;
    name: string;
    completed: boolean;
    active?: boolean;
    pending?: boolean;
  }[];
}

// Interface pour les documents étudiants stockés dans Firebase
interface StudentDocument extends FirestoreDocument {
  id: string;
  studentId: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "not_uploaded";
  uploadDate?: string;
  fileSize?: string;
  feedback?: string;
  required: boolean;
  fileUrl?: string;
  fileName?: string;
}

// Interface pour les documents des travailleurs et artistes
interface WorkerArtistDocument extends FirestoreDocument {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "not_uploaded";
  uploadDate?: string;
  fileSize?: string;
  feedback?: string;
  required: boolean;
  fileUrl?: string;
  fileName?: string;
}

export default function ApplicationDetail() {
  const { id } = useParams() as { id: string };

  const [application, setApplication] = useState<FormattedApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [updatingDocId, setUpdatingDocId] = useState<string | null>(null);

  // Récupérer les documents d'identité du candidat
  const [userDocuments, setUserDocuments] = useState<UserDocuments>({});
  const [loadingUserDocs, setLoadingUserDocs] = useState(false);

  // Documents étudiants depuis Firebase Storage
  const [studentDocuments, setStudentDocuments] = useState<StudentDocument[]>(
    []
  );
  // Documents des travailleurs et artistes depuis Firebase Storage
  const [workerArtistDocuments, setWorkerArtistDocuments] = useState<
    WorkerArtistDocument[]
  >([]);
  const [loadingStudentDocs, setLoadingStudentDocs] = useState(false);
  const [loadingWorkerArtistDocs, setLoadingWorkerArtistDocs] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);

      try {
        // Essayer d'abord de récupérer la candidature étudiant
        let applicationData = await firestoreService.getDocument<Application>(
          "studentApplications",
          id
        );

        // Si non trouvée, essayer de récupérer la candidature travailleur
        if (!applicationData) {
          applicationData = await firestoreService.getDocument<Application>(
            "workerApplications",
            id
          );
        }

        // Si non trouvée, essayer de récupérer la candidature artiste
        if (!applicationData) {
          applicationData = await firestoreService.getDocument<Application>(
            "artistApplications",
            id
          );
        }

        if (!applicationData) {
          setError("Candidature non trouvée");
          return;
        }

        // Adapter les données pour l'affichage
        const formattedApplication: FormattedApplication = {
          ...applicationData,
          applicantName: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
          applicantEmail: applicationData.personalInfo.email,
          phone: applicationData.personalInfo.phone,
          type: applicationData.professionalInfo
            ? "worker"
            : applicationData.artisticInfo
            ? "artist"
            : "student",
          program: applicationData.educationInfo?.targetFormation,
          position: applicationData.professionalInfo?.desiredPosition,
          portfolio: applicationData.artisticInfo?.style,
          motivation: applicationData.motivationLetter,
          submissionDate:
            applicationData.submittedAt || applicationData.updatedAt,
          status: applicationData.status,
        };

        setApplication(formattedApplication);
        setNotes(applicationData.notes || "");
      } catch (err) {
        console.error("Erreur lors de la récupération de la candidature:", err);
        setError(
          "Une erreur est survenue lors du chargement de la candidature"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDocuments = async () => {
      if (!application?.applicantEmail) return;

      setLoadingUserDocs(true);
      try {
        // Chercher l'utilisateur par email
        const users = await firestoreService.queryDocuments("users", [
          where("email", "==", application.applicantEmail),
        ]);

        if (users?.length > 0) {
          const userId = users[0].id;

          // Récupérer les documents d'identité
          const docs = await firestoreService.queryDocuments<UserDocuments>(
            "userDocuments",
            [where("userId", "==", userId)]
          );

          if (docs?.length > 0) {
            setUserDocuments(docs[0]);
          }

          // Récupérer également les documents étudiants depuis Firebase
          if (userId) {
            if (application.type === "student") {
              await fetchStudentDocuments(userId);
            } else if (application.type === "worker") {
              await fetchWorkerDocuments(userId);
            } else if (application.type === "artist") {
              await fetchArtistDocuments(userId);
            }
          }
        }
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des documents d'identité:",
          err
        );
      } finally {
        setLoadingUserDocs(false);
      }
    };

    // Nouvelle fonction pour récupérer les documents étudiants
    const fetchStudentDocuments = async (userId: string) => {
      setLoadingStudentDocs(true);
      try {
        // Récupérer les documents étudiants
        const docs = await firestoreService.queryDocuments<StudentDocument>(
          "studentDocuments",
          [where("studentId", "==", userId)]
        );

        if (docs?.length > 0) {
          setStudentDocuments(docs);
        }
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des documents étudiants:",
          err
        );
      } finally {
        setLoadingStudentDocs(false);
      }
    };

    // Fonction pour récupérer les documents des travailleurs
    const fetchWorkerDocuments = async (userId: string) => {
      setLoadingWorkerArtistDocs(true);
      try {
        // Récupérer les documents des travailleurs
        const docs =
          await firestoreService.getAllDocuments<WorkerArtistDocument>(
            `workers/${userId}/documents`
          );

        if (docs?.length > 0) {
          setWorkerArtistDocuments(docs);
        }
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des documents du travailleur:",
          err
        );
      } finally {
        setLoadingWorkerArtistDocs(false);
      }
    };

    // Fonction pour récupérer les documents des artistes
    const fetchArtistDocuments = async (userId: string) => {
      setLoadingWorkerArtistDocs(true);
      try {
        // Récupérer le document de l'artiste
        const artistDoc =
          await firestoreService.getDocument<ArtistDocumentsDocument>(
            "artists",
            userId
          );

        if (artistDoc?.documents && artistDoc.documents.length > 0) {
          setWorkerArtistDocuments(artistDoc.documents);
        }
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des documents de l'artiste:",
          err
        );
      } finally {
        setLoadingWorkerArtistDocs(false);
      }
    };

    if (id) {
      fetchApplication();
      fetchUserDocuments();
    }
  }, [id, application?.applicantEmail, application?.type]);

  // Formatter les dates
  const formatDate = (timestamp: Timestamp | string | undefined): string => {
    if (!timestamp) return "Date inconnue";

    let date;
    if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else {
      return "Date inconnue";
    }

    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Mettre à jour le statut
  const updateStatus = async (newStatus: FormattedApplication["status"]) => {
    if (!application) return;

    setLoading(true);
    try {
      const collection =
        application.type === "worker"
          ? "workerApplications"
          : application.type === "artist"
          ? "artistApplications"
          : "studentApplications";

      await firestoreService.updateDocument(collection, application.id, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      } as unknown as Application);

      setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les notes
  const saveNotes = async () => {
    if (!application) return;

    setSaving(true);
    try {
      const collection =
        application.type === "worker"
          ? "workerApplications"
          : application.type === "artist"
          ? "artistApplications"
          : "studentApplications";

      await firestoreService.updateDocument(collection, application.id, {
        notes,
        updatedAt: Timestamp.now(),
      } as unknown as Application);

      toast.success("Notes enregistrées");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des notes:", err);
      toast.error("Erreur lors de l'enregistrement des notes");
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour afficher un document avec le bon icône selon son type
  const renderDocumentLink = (
    url: string | undefined,
    title: string,
    type: string
  ) => {
    if (!url) return null;

    let icon;
    switch (type) {
      case "pdf":
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600 dark:text-red-400 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
            <path d="M8 11a1 1 0 100-2H7a1 1 0 000 2h1zm2 0a1 1 0 100-2 1 1 0 000 2zm2-1a1 1 0 011-1 1 1 0 110 2h-1a1 1 0 01-1-1z" />
          </svg>
        );
        break;
      case "image":
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        );
        break;
      default:
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {icon}
        <div>
          <span className="block text-gray-900 dark:text-white font-medium">
            {title}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Voir le document
          </span>
        </div>
      </a>
    );
  };

  // Fonction pour mettre à jour le statut d'un document étudiant
  const updateStudentDocumentStatus = async (
    document: StudentDocument,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    if (!application?.id) return;

    try {
      setUpdatingDocId(document.id);

      // Mettre à jour le statut dans Firestore
      await firestoreService.updateDocument(
        "studentDocuments",
        `${document.studentId}_${document.id}`,
        {
          status: newStatus,
          feedback:
            newStatus === "rejected"
              ? "Document refusé par l'administrateur"
              : newStatus === "approved"
              ? "Document approuvé par l'administrateur"
              : "",
        }
      );

      // Mettre à jour l'état local
      setStudentDocuments((prev) =>
        prev.map((doc) =>
          doc.id === document.id ? { ...doc, status: newStatus } : doc
        )
      );

      toast.success(
        `Document ${
          newStatus === "approved" ? "approuvé" : "refusé"
        } avec succès`
      );
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut du document:",
        error
      );
      toast.error("Erreur lors de la mise à jour du statut du document");
    } finally {
      setUpdatingDocId(null);
    }
  };

  // Fonction pour mettre à jour le statut d'un document travailleur
  const updateWorkerDocumentStatus = async (
    document: WorkerArtistDocument,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    if (!application?.id || !document.id) return;

    try {
      setUpdatingDocId(document.id);

      // Récupérer l'ID utilisateur à partir de l'email de l'application
      const users = await firestoreService.queryDocuments("users", [
        where("email", "==", application.applicantEmail),
      ]);

      if (!users?.length) {
        toast.error("Utilisateur non trouvé");
        return;
      }

      const userId = users[0].id;

      // Mettre à jour le document dans la collection workers
      await firestoreService.updateDocument(
        `workers/${userId}/documents`,
        document.id,
        {
          status: newStatus,
          feedback:
            newStatus === "rejected"
              ? "Document refusé par l'administrateur"
              : newStatus === "approved"
              ? "Document approuvé par l'administrateur"
              : "",
        }
      );

      // Mettre à jour l'état local
      setWorkerArtistDocuments((prev) =>
        prev.map((doc) =>
          doc.id === document.id ? { ...doc, status: newStatus } : doc
        )
      );

      toast.success(
        `Document ${
          newStatus === "approved" ? "approuvé" : "refusé"
        } avec succès`
      );
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut du document:",
        error
      );
      toast.error("Erreur lors de la mise à jour du statut du document");
    } finally {
      setUpdatingDocId(null);
    }
  };

  // Fonction pour mettre à jour le statut d'un document artiste
  const updateArtistDocumentStatus = async (
    document: WorkerArtistDocument,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    if (!application?.id || !document.id) return;

    try {
      setUpdatingDocId(document.id);

      // Récupérer l'ID utilisateur à partir de l'email de l'application
      const users = await firestoreService.queryDocuments("users", [
        where("email", "==", application.applicantEmail),
      ]);

      if (!users?.length) {
        toast.error("Utilisateur non trouvé");
        return;
      }

      const userId = users[0].id;
      if (!userId) {
        toast.error("ID utilisateur non trouvé");
        return;
      }

      // Récupérer le document artiste complet
      const artistDoc =
        await firestoreService.getDocument<ArtistDocumentsDocument>(
          "artists",
          userId
        );

      if (!artistDoc?.documents) {
        toast.error("Documents de l'artiste non trouvés");
        return;
      }

      // Mettre à jour le statut du document spécifique
      const updatedDocuments = artistDoc.documents.map((doc) =>
        doc.id === document.id
          ? {
              ...doc,
              status: newStatus,
              feedback:
                newStatus === "rejected"
                  ? "Document refusé par l'administrateur"
                  : newStatus === "approved"
                  ? "Document approuvé par l'administrateur"
                  : "",
            }
          : doc
      );

      // Mettre à jour le document dans Firestore
      await firestoreService.updateDocument("artists", userId, {
        documents: updatedDocuments,
      });

      // Mettre à jour l'état local
      setWorkerArtistDocuments((prev) =>
        prev.map((doc) =>
          doc.id === document.id ? { ...doc, status: newStatus } : doc
        )
      );

      toast.success(
        `Document ${
          newStatus === "approved" ? "approuvé" : "refusé"
        } avec succès`
      );
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut du document:",
        error
      );
      toast.error("Erreur lors de la mise à jour du statut du document");
    } finally {
      setUpdatingDocId(null);
    }
  };

  // Handler générique pour la mise à jour du statut d'un document
  const handleUpdateDocumentStatus = async (
    document: StudentDocument | WorkerArtistDocument,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    if (!application) return;

    if (application.type === "student") {
      await updateStudentDocumentStatus(document as StudentDocument, newStatus);
    } else if (application.type === "worker") {
      await updateWorkerDocumentStatus(
        document as WorkerArtistDocument,
        newStatus
      );
    } else if (application.type === "artist") {
      await updateArtistDocumentStatus(
        document as WorkerArtistDocument,
        newStatus
      );
    }
  };

  // Mettre à jour le composant StudentDocumentItem pour inclure les boutons d'approbation/rejet
  const StudentDocumentItem: React.FC<{
    document: StudentDocument | WorkerArtistDocument;
  }> = ({ document }) => {
    if (!document.fileUrl) return null;

    // Déterminer le type de document basé sur l'extension de fichier
    let documentType = "default";
    if (document.fileName) {
      if (document.fileName.toLowerCase().endsWith(".pdf")) {
        documentType = "pdf";
      } else if (/\.(jpe?g|png|gif|webp|svg)$/i.test(document.fileName)) {
        documentType = "image";
      }
    }

    // Sélectionner l'icône appropriée
    let documentIcon;
    if (documentType === "pdf") {
      documentIcon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-600 dark:text-red-400 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
          <path d="M8 11a1 1 0 100-2H7a1 1 0 000 2h1zm2 0a1 1 0 100-2 1 1 0 000 2zm2-1a1 1 0 011-1 1 1 0 110 2h-1a1 1 0 01-1-1z" />
        </svg>
      );
    } else if (documentType === "image") {
      documentIcon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      documentIcon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <a
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          {documentIcon}
          <div className="flex-1">
            <div className="flex items-center">
              <span className="block text-gray-900 dark:text-white font-medium">
                {document.name}
              </span>
              {getStatusBadgeForDocument(document.status)}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {document.uploadDate && `Téléversé le ${document.uploadDate}`}
              {document.fileSize && ` • ${document.fileSize}`}
            </span>
          </div>
        </a>

        {document.status !== "approved" && document.status !== "rejected" && (
          <div className="flex border-t border-gray-200 dark:border-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
            <button
              onClick={() => handleUpdateDocumentStatus(document, "approved")}
              disabled={updatingDocId === document.id}
              className="flex-1 py-2 text-xs font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 transition-colors"
            >
              {updatingDocId === document.id ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-1"
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
                  Approbation...
                </span>
              ) : (
                "Approuver"
              )}
            </button>
            <button
              onClick={() => handleUpdateDocumentStatus(document, "rejected")}
              disabled={updatingDocId === document.id}
              className="flex-1 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              {updatingDocId === document.id ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-1"
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
                  Refus...
                </span>
              ) : (
                "Rejeter"
              )}
            </button>
          </div>
        )}

        {(document.status === "approved" || document.status === "rejected") && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleUpdateDocumentStatus(document, "pending")}
              disabled={updatingDocId === document.id}
              className="w-full py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 transition-colors"
            >
              {updatingDocId === document.id ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-1"
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
                  Réinitialisation...
                </span>
              ) : (
                "Remettre en attente"
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Fonction pour obtenir un badge de statut pour les documents
  const getStatusBadgeForDocument = (status: StudentDocument["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            En attente
          </span>
        );
      case "approved":
        return (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Approuvé
          </span>
        );
      case "rejected":
        return (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Rejeté
          </span>
        );
      case "not_uploaded":
        return (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Non téléversé
          </span>
        );
      default:
        return null;
    }
  };

  // Afficher l'indicateur de chargement
  if (loading) {
    return (
      <AdminRoute>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </AdminRoute>
    );
  }

  // Afficher l'erreur
  if (error || !application) {
    return (
      <AdminRoute>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Détail de la candidature
            </h1>
            <Link
              href="/dashboard/admin/applications"
              className="btn-secondary"
            >
              Retour aux candidatures
            </Link>
          </div>
          <div className="glass-card p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
              {error || "Candidature non trouvée"}
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  // Badge pour le type
  const getTypeBadge = () => {
    switch (application.type) {
      case "student":
        return (
          <span className="ml-3 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Étudiant
          </span>
        );
      case "worker":
        return (
          <span className="ml-3 px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Travailleur
          </span>
        );
      case "artist":
        return (
          <span className="ml-3 px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            Artiste
          </span>
        );
      default:
        return null;
    }
  };

  // Badge pour le statut
  const getStatusBadge = () => {
    switch (application.status) {
      case "draft":
        return (
          <span className="px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Brouillon
          </span>
        );
      case "submitted":
        return (
          <span className="px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            En attente
          </span>
        );
      case "reviewing":
        return (
          <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            En révision
          </span>
        );
      case "accepted":
        return (
          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Approuvée
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Rejetée
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminRoute>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/dashboard/admin/applications"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Retour aux candidatures
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              Candidature de {application.applicantName}
              {getTypeBadge()}
            </h1>
          </div>
          <div className="flex space-x-2">
            {!loading && application && (
              <>
                {application.status !== "accepted" && (
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600"
                    onClick={() => updateStatus("accepted")}
                    disabled={saving}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {saving ? "..." : "Approuver"}
                  </button>
                )}
                {application.status !== "rejected" && (
                  <button
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"
                    onClick={() => updateStatus("rejected")}
                    disabled={saving}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {saving ? "..." : "Rejeter"}
                  </button>
                )}
                {application.status !== "reviewing" &&
                  application.status !== "accepted" &&
                  application.status !== "rejected" && (
                    <button
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                      onClick={() => updateStatus("reviewing")}
                      disabled={saving}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {saving ? "..." : "Mettre en révision"}
                    </button>
                  )}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Informations générales */}
          <div className="glass-card p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Informations générales
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  ID:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {application.id}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Nom:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {application.applicantName}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Email:
                </span>
                <a
                  href={`mailto:${application.applicantEmail}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  {application.applicantEmail}
                </a>
              </div>
              {application.phone && (
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Téléphone:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {application.phone}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Type:
                </span>
                <span>{getTypeBadge()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Date de soumission:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(application.submissionDate)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Statut:
                </span>
                <span>{getStatusBadge()}</span>
              </div>
            </div>
          </div>

          {/* Notes administratives */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Notes administratives
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ajouter des notes concernant cette candidature..."
            ></textarea>
            <button
              className="btn-primary w-full mt-3"
              onClick={saveNotes}
              disabled={saving}
            >
              {saving ? "Enregistrement..." : "Enregistrer les notes"}
            </button>
          </div>
        </div>

        {/* Détails spécifiques selon le type */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {application.type === "student"
              ? "Détails du programme d'études"
              : application.type === "worker"
              ? "Détails professionnels"
              : "Détails du portfolio artistique"}
          </h2>

          <div className="space-y-4">
            {application.type === "student" && application.educationInfo && (
              <>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Programme visé:
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {application.educationInfo.targetFormation}
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dernier diplôme:
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {application.educationInfo.lastDiploma}
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Établissement:
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {application.educationInfo.school}
                  </p>
                </div>
              </>
            )}

            {application.type === "worker" && application.professionalInfo && (
              <>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Poste recherché:
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {application.professionalInfo.desiredPosition}
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expérience:
                  </h3>
                  <p className="text-gray-900 dark:text-white whitespace-pre-line">
                    {application.professionalInfo.experience}
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compétences:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.professionalInfo.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-800 dark:text-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Disponibilité:
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {application.professionalInfo.availability}
                  </p>
                </div>
              </>
            )}

            {application.type === "artist" && application.portfolio && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio:
                </h3>
                <a
                  href={application.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center"
                >
                  Voir le portfolio
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            )}

            {application.experience && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expérience:
                </h3>
                <p className="text-gray-900 dark:text-white whitespace-pre-line">
                  {application.experience}
                </p>
              </div>
            )}

            {application.motivation && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivation:
                </h3>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap break-words overflow-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {application.motivation}
                </p>
              </div>
            )}

            {application.skills && application.skills.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compétences:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-800 dark:text-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {application.languages && application.languages.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Langues:
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {application.languages.map((lang, index) => (
                    <li key={index} className="text-gray-900 dark:text-white">
                      {lang.language}: {lang.level}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {application.education && application.education.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Formation:
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {application.education.map((edu, index) => (
                    <li key={index} className="text-gray-900 dark:text-white">
                      <div className="font-medium">{edu.degree}</div>
                      <div>
                        {edu.institution}, {edu.year}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        {application.documents && application.documents.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Documents fournis avec la candidature
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <span className="block text-gray-900 dark:text-white font-medium">
                      {doc.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Voir le document
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Documents d'identité et pièces justificatives */}

        {/* Documents étudiants depuis Firebase Storage */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Documents de candidature
          </h2>

          {loadingStudentDocs || loadingWorkerArtistDocs ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Chargement des documents...
              </span>
            </div>
          ) : (
            <>
              {application?.type === "student" &&
                studentDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    Aucun document de candidature téléversé par cet étudiant.
                  </div>
                )}
              {application?.type === "student" &&
                studentDocuments.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentDocuments.map((doc) => (
                      <StudentDocumentItem key={doc.id} document={doc} />
                    ))}
                  </div>
                )}

              {(application?.type === "worker" ||
                application?.type === "artist") &&
                workerArtistDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    Aucun document de candidature téléversé par ce{" "}
                    {application?.type === "worker" ? "travailleur" : "artiste"}
                    .
                  </div>
                )}
              {(application?.type === "worker" ||
                application?.type === "artist") &&
                workerArtistDocuments.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workerArtistDocuments.map((doc) => (
                      <StudentDocumentItem key={doc.id} document={doc} />
                    ))}
                  </div>
                )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/dashboard/admin/application/${id}/edit`}
              className="btn-secondary"
            >
              Éditer cette candidature
            </Link>
            <Link
              href={`/dashboard/admin/messages?new=true&userEmail=${encodeURIComponent(
                application.applicantEmail
              )}&userName=${encodeURIComponent(
                application.applicantName
              )}&userType=${encodeURIComponent(application.type)}`}
              className="btn-primary"
            >
              Contacter le candidat
            </Link>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
