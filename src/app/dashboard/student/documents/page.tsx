"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import {
  FirestoreDocument,
  firestoreService,
  storageService,
} from "@/firebase";
import { Timestamp, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

// Types pour les documents
interface DocumentMetadata
  extends Omit<FirestoreDocument, "createdAt" | "updatedAt"> {
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
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export default function StudentDocuments() {
  const { userData } = useAuth();
  const toast = useToast();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null); // ID du document en cours d'upload
  const [initialized, setInitialized] = useState(false);

  // Références pour les input file
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputDetailRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef(toast);

  // Update toast ref when toast changes
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  // Charger les documents de l'étudiant
  useEffect(() => {
    // Éviter les exécutions multiples
    if (initialized || !userData?.id) return;

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        // Récupérer les documents depuis Firestore
        const docsResult =
          await firestoreService.queryDocuments<DocumentMetadata>(
            "studentDocuments",
            [where("studentId", "==", userData.id)]
          );

        if (docsResult?.length > 0) {
          setDocuments(docsResult);
        } else {
          // Liste des documents requis par défaut
          const defaultDocuments: Omit<DocumentMetadata, "studentId">[] = [
            {
              id: "cv",
              name: "Curriculum Vitae",
              type: "pdf",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "diploma",
              name: "Diplôme / Attestation de réussite",
              type: "pdf,jpg,png",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "transcript",
              name: "Relevés de notes",
              type: "pdf",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "motivation",
              name: "Lettre de motivation",
              type: "pdf,docx",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "passport",
              name: "Passeport / Pièce d'identité",
              type: "pdf,jpg,png",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "recommendation",
              name: "Lettres de recommandation",
              type: "pdf",
              status: "not_uploaded",
              required: false,
            },
          ];

          // Créer les documents par défaut s'ils n'existent pas
          try {
            const newDocs = await Promise.all(
              defaultDocuments.map(async (doc) => {
                const docWithStudentId: DocumentMetadata = {
                  id: doc.id as string,
                  name: doc.name as string,
                  type: doc.type as string,
                  status: doc.status as
                    | "pending"
                    | "approved"
                    | "rejected"
                    | "not_uploaded",
                  required: doc.required as boolean,
                  studentId: userData.id,
                };
                // Utiliser l'ID composé pour garantir l'unicité des documents
                const documentId = `${userData.id}_${doc.id}`;

                // Vérifier si le document existe déjà
                const existingDoc = await firestoreService.getDocument(
                  "studentDocuments",
                  documentId
                );

                if (!existingDoc) {
                  // Créer le document s'il n'existe pas
                  await firestoreService.createDocument(
                    "studentDocuments",
                    documentId,
                    docWithStudentId
                  );
                }

                return docWithStudentId;
              })
            );
            setDocuments(newDocs);
            toastRef.current.success("Documents initialisés avec succès");
          } catch (error) {
            console.error("Erreur lors de la création des documents:", error);
            toastRef.current.error(
              "Erreur lors de l'initialisation des documents"
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des documents:", error);
        toastRef.current.error("Erreur lors du chargement des documents");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchDocuments();
  }, [userData?.id, initialized]);

  // Fonction pour téléverser un document
  const handleUploadFile = async (docId: string, file: File) => {
    if (!userData?.id || !file) return;

    try {
      setUploading(docId);
      const selectedDoc = documents.find((doc) => doc.id === docId);

      if (!selectedDoc) {
        toastRef.current.error("Document non trouvé");
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = selectedDoc.type.split(",");
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        toastRef.current.error(
          `Type de fichier non supporté. Types acceptés: ${allowedTypes
            .map((type) => `.${type}`)
            .join(", ")}`
        );
        return;
      }

      // Vérifier la taille du fichier (max 10 MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB en octets
      if (file.size > MAX_FILE_SIZE) {
        toastRef.current.error(
          "Le fichier est trop volumineux. Taille maximale: 10 MB"
        );
        return;
      }

      // Calculer la taille du fichier
      const fileSizeKB = Math.round(file.size / 1024);
      const fileSizeFormatted =
        fileSizeKB >= 1024
          ? `${(fileSizeKB / 1024).toFixed(1)} MB`
          : `${fileSizeKB} KB`;

      // Générer le chemin de stockage
      const filePath = storageService.generateFilePath(
        userData.id,
        file.name,
        "documents"
      );

      // Feedback pour l'utilisateur
      toastRef.current.loading("Téléversement en cours...");

      // Téléverser le fichier vers Firebase Storage
      const fileUrl = await storageService.uploadFile(filePath, file);

      // Mettre à jour les métadonnées du document dans Firestore
      const updatedDoc: Partial<DocumentMetadata> = {
        status: "pending",
        uploadDate: new Date().toISOString().split("T")[0],
        fileSize: fileSizeFormatted,
        fileUrl: fileUrl,
        fileName: file.name,
      };

      // Mettre à jour le document dans Firestore
      await firestoreService.updateDocument(
        "studentDocuments",
        `${userData.id}_${docId}`,
        updatedDoc
      );

      // Mettre à jour l'état local
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === docId ? { ...doc, ...updatedDoc } : doc
        )
      );

      // Mettre à jour le document sélectionné
      if (selectedDocument?.id === docId) {
        setSelectedDocument((prev) =>
          prev ? { ...prev, ...updatedDoc } : null
        );
      }

      toastRef.current.dismiss();
      toastRef.current.success("Document téléversé avec succès");
    } catch (error) {
      console.error("Erreur lors du téléversement:", error);
      toastRef.current.dismiss();

      let errorMessage = "Erreur lors du téléversement du document";

      // Vérifier si l'erreur vient de Firebase
      if (error instanceof Error) {
        if (error.message.includes("storage/unauthorized")) {
          errorMessage = "Vous n'êtes pas autorisé à téléverser des fichiers";
        } else if (error.message.includes("storage/quota-exceeded")) {
          errorMessage = "Quota de stockage dépassé";
        } else if (error.message.includes("storage/canceled")) {
          errorMessage = "Téléversement annulé";
        } else if (error.message.includes("storage/unknown")) {
          errorMessage = "Une erreur inconnue s'est produite";
        } else if (error.message.includes("storage/object-not-found")) {
          errorMessage = "Le fichier n'a pas été trouvé";
        } else if (error.message.includes("network-error")) {
          errorMessage = "Problème de connexion réseau";
        }
      }

      toastRef.current.error(errorMessage);
    } finally {
      setUploading(null);
    }
  };

  // Gérer le changement de fichier
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    docId: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadFile(docId, file);
    }
  };

  // Initier l'upload pour un document spécifique
  const initiateUpload = (
    docId: string,
    ref:
      | React.RefObject<HTMLInputElement>
      | React.MutableRefObject<HTMLInputElement | null>
  ) => {
    if (ref && ref.current) {
      ref.current.click();
    }
  };

  // Télécharger un document
  const handleDownload = async (docId: string) => {
    try {
      const doc = documents.find((d) => d.id === docId);

      if (doc?.fileUrl) {
        // Ouvrir l'URL dans un nouvel onglet
        window.open(doc.fileUrl, "_blank");
      } else {
        toastRef.current.error("Aucun fichier disponible pour ce document");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toastRef.current.error("Erreur lors du téléchargement du document");
    }
  };

  // Icônes pour les différents statuts
  const statusIcons = {
    pending: (
      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    approved: (
      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-400">
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
    ),
    rejected: (
      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    not_uploaded: (
      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
  };

  // Input file caché pour le téléversement
  const fileInput = (
    <input
      type="file"
      className="hidden"
      ref={fileInputRef}
      onChange={(e) => {
        if (uploading) {
          handleFileChange(e, uploading);
        }
      }}
    />
  );

  // Input file caché pour la vue détaillée
  const fileInputDetail = (
    <input
      type="file"
      className="hidden"
      ref={fileInputDetailRef}
      onChange={(e) => {
        if (selectedDocument) {
          handleFileChange(e, selectedDocument.id);
        }
      }}
    />
  );

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
        Mes Documents
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Liste des documents */}
        <div className="lg:col-span-2">
          <div className="glass-card p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                Documents requis
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Veuillez téléverser tous les documents requis pour compléter
                votre dossier de candidature.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-center mb-2 sm:mb-0">
                    {statusIcons[doc.status]}
                    <div className="ml-3 sm:ml-4">
                      <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
                        {doc.name}
                        {doc.required && (
                          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Requis
                          </span>
                        )}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {doc.status === "not_uploaded" ? (
                          "Non téléversé"
                        ) : (
                          <>
                            Mis à jour le {doc.uploadDate} • {doc.fileSize}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    {doc.status === "not_uploaded" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploading(doc.id);
                          initiateUpload(doc.id, fileInputRef);
                        }}
                        className="w-full sm:w-auto px-3 py-1.5 bg-primary-600 text-white text-xs sm:text-sm rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!!uploading}
                      >
                        {uploading === doc.id ? (
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
                            Téléversement...
                          </span>
                        ) : (
                          "Téléverser"
                        )}
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploading(doc.id);
                            initiateUpload(doc.id, fileInputRef);
                          }}
                          className="w-full sm:w-auto px-3 py-1.5 bg-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!!uploading}
                        >
                          {uploading === doc.id
                            ? "Téléversement..."
                            : "Remplacer"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aperçu et détails du document */}
        <div className="glass-card p-4 sm:p-6">
          {selectedDocument ? (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Détails du document
              </h2>

              <div className="mb-4 sm:mb-6">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  {selectedDocument.status === "not_uploaded" ? (
                    <div className="text-center p-4 sm:p-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Aucun document téléversé
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-4 sm:p-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {selectedDocument.fileName || "Aperçu du document"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Nom
                    </p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      {selectedDocument.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Statut
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {selectedDocument.status === "pending" && (
                        <span className="text-amber-600 dark:text-amber-400">
                          En attente de validation
                        </span>
                      )}
                      {selectedDocument.status === "approved" && (
                        <span className="text-green-600 dark:text-green-400">
                          Approuvé
                        </span>
                      )}
                      {selectedDocument.status === "rejected" && (
                        <span className="text-red-600 dark:text-red-400">
                          Refusé
                        </span>
                      )}
                      {selectedDocument.status === "not_uploaded" && (
                        <span className="text-gray-600 dark:text-gray-400">
                          Non téléversé
                        </span>
                      )}
                    </p>
                  </div>

                  {selectedDocument.uploadDate && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Date de téléversement
                      </p>
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                        {selectedDocument.uploadDate}
                      </p>
                    </div>
                  )}

                  {selectedDocument.feedback && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Commentaire
                      </p>
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                        {selectedDocument.feedback}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Formats acceptés
                    </p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      {selectedDocument.type.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedDocument.status === "not_uploaded" ? (
                <button
                  onClick={() => {
                    setUploading(selectedDocument.id);
                    initiateUpload(selectedDocument.id, fileInputDetailRef);
                  }}
                  className="w-full btn-primary py-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!!uploading}
                >
                  {uploading === selectedDocument.id ? (
                    <span className="flex items-center justify-center">
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
                      Téléversement en cours...
                    </span>
                  ) : (
                    "Téléverser ce document"
                  )}
                </button>
              ) : (
                <div className="flex space-x-2 sm:space-x-3">
                  <button
                    className="flex-1 btn-secondary py-2 text-xs sm:text-sm"
                    onClick={() => handleDownload(selectedDocument.id)}
                  >
                    Télécharger
                  </button>
                  <button
                    className="flex-1 btn-primary py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setUploading(selectedDocument.id);
                      initiateUpload(selectedDocument.id, fileInputDetailRef);
                    }}
                    disabled={!!uploading}
                  >
                    {uploading === selectedDocument.id
                      ? "Téléversement..."
                      : "Remplacer"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                Sélectionnez un document
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Cliquez sur un document pour voir ses détails
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inputs file cachés pour téléversement */}
      {fileInput}
      {fileInputDetail}
    </div>
  );
}
