"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import {
  FirestoreDocument,
  firestoreService,
  storageService,
} from "@/firebase";
import { useEffect, useRef, useState } from "react";

// Types pour les documents
interface Document extends FirestoreDocument {
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
  progressSteps: {
    id: number;
    name: string;
    completed: boolean;
    active?: boolean;
    pending?: boolean;
  }[];
}

export default function ArtistDocuments() {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Références pour suivre l'état du chargement
  const isDataFetchingRef = useRef(false);
  const isDataLoadedRef = useRef(false);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user?.uid || isDataFetchingRef.current || isDataLoadedRef.current) {
        return;
      }

      isDataFetchingRef.current = true;
      setIsLoading(true);

      try {
        const artistDocuments =
          await firestoreService.getDocument<ArtistDocumentsDocument>(
            "artists",
            user.uid
          );

        if (artistDocuments?.documents) {
          setDocuments(artistDocuments.documents);
          isDataLoadedRef.current = true;
        } else {
          // Si aucun document n'existe, initialiser avec une structure vide
          const defaultDocuments: Document[] = [
            {
              id: "cv",
              name: "Curriculum Vitae artistique",
              type: "pdf",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "id",
              name: "Pièce d'identité",
              type: "pdf,jpg,png",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "artistStatement",
              name: "Démarche artistique",
              type: "pdf",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "coverLetter",
              name: "Lettre de motivation",
              type: "pdf,docx",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "exhibitions",
              name: "Liste des expositions/performances",
              type: "pdf,docx",
              status: "not_uploaded",
              required: true,
            },
            {
              id: "certifications",
              name: "Diplômes artistiques",
              type: "pdf,jpg,png",
              status: "not_uploaded",
              required: false,
            },
            {
              id: "recommendations",
              name: "Lettres de recommandation",
              type: "pdf",
              status: "not_uploaded",
              required: false,
            },
            {
              id: "mediaReviews",
              name: "Revues de presse",
              type: "pdf",
              status: "not_uploaded",
              required: false,
            },
            {
              id: "technicalRider",
              name: "Fiche technique (si applicable)",
              type: "pdf",
              status: "not_uploaded",
              required: false,
            },
          ];

          await firestoreService.updateDocument<ArtistDocumentsDocument>(
            "artists",
            user.uid,
            {
              documents: defaultDocuments,
            }
          );

          setDocuments(defaultDocuments);
          isDataLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Erreur lors du chargement des documents");
      } finally {
        setIsLoading(false);
        isDataFetchingRef.current = false;
      }
    };

    loadDocuments();
  }, [user?.uid, toast]);

  const handleUpload = async (docId: string) => {
    if (fileInputRef.current) {
      setUploadingDoc(docId);
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingDoc || !user?.uid) {
      setUploadingDoc(null);
      return;
    }

    try {
      // Vérifier le document sélectionné
      const selectedDoc = documents.find((doc) => doc.id === uploadingDoc);
      if (!selectedDoc) {
        toast.error("Document non trouvé");
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = selectedDoc.type.split(",");
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        toast.error(
          `Type de fichier non supporté. Types acceptés: ${allowedTypes
            .map((type) => `.${type}`)
            .join(", ")}`
        );
        return;
      }

      // Vérifier la taille du fichier (max 10 MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB en octets
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Le fichier est trop volumineux. Taille maximale: 10 MB");
        return;
      }

      // Afficher le toast de chargement
      toast.loading("Téléversement en cours...");

      // Générer un chemin unique pour le fichier
      const filePath = storageService.generateFilePath(
        user.uid,
        file.name,
        "artist_documents"
      );

      // Téléverser le fichier vers Firebase Storage
      const downloadURL = await storageService.uploadFile(filePath, file);

      // Calculer la taille du fichier
      const fileSizeKB = Math.round(file.size / 1024);
      const fileSizeFormatted =
        fileSizeKB >= 1024
          ? `${(fileSizeKB / 1024).toFixed(1)} MB`
          : `${fileSizeKB} KB`;

      // Mettre à jour le document dans Firestore
      const updatedDocuments = documents.map((doc) =>
        doc.id === uploadingDoc
          ? {
              ...doc,
              status: "pending" as const,
              uploadDate: new Date().toLocaleDateString(),
              fileSize: fileSizeFormatted,
              fileUrl: downloadURL,
              fileName: file.name,
            }
          : doc
      );

      await firestoreService.updateDocument<ArtistDocumentsDocument>(
        "artists",
        user.uid,
        {
          documents: updatedDocuments,
        }
      );

      setDocuments(updatedDocuments);

      // Mettre à jour le document sélectionné
      if (selectedDocument?.id === uploadingDoc) {
        setSelectedDocument(
          updatedDocuments.find((doc) => doc.id === uploadingDoc) || null
        );
      }

      toast.dismiss();
      toast.success("Document uploadé avec succès");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.dismiss();

      let errorMessage = "Erreur lors de l'upload du document";

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

      toast.error(errorMessage);
    } finally {
      setUploadingDoc(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Icônes pour les différents statuts
  const statusIcons = {
    approved: (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    ),
    pending: (
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
    ),
    rejected: (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
      </div>
    ),
    not_uploaded: (
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
    ),
  };

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
          Documents requis
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Liste des documents */}
        <div className="lg:col-span-2">
          <div className="glass-card p-4 sm:p-6">
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Documents requis
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Veuillez téléverser tous les documents requis pour compléter
                votre dossier de candidature.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer ${
                    selectedDocument?.id === doc.id
                      ? "ring-2 ring-primary-500"
                      : ""
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-center mb-2 sm:mb-0">
                    {statusIcons[doc.status]}
                    <div className="ml-2 sm:ml-3">
                      <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white flex items-center flex-wrap gap-1 sm:gap-2">
                        {doc.name}
                        {doc.required && (
                          <span className="inline-block text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Requis
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                        {doc.status === "not_uploaded"
                          ? "Non téléversé"
                          : `Mis à jour le ${doc.uploadDate || "N/A"} • ${
                              doc.fileSize || "N/A"
                            }`}
                      </p>
                    </div>
                  </div>

                  <div className="sm:ml-2">
                    {doc.status === "not_uploaded" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpload(doc.id);
                        }}
                        className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 bg-primary-600 text-white text-xs sm:text-sm rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                        disabled={uploadingDoc === doc.id}
                      >
                        {uploadingDoc === doc.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Téléversement...
                          </>
                        ) : (
                          "Téléverser"
                        )}
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpload(doc.id);
                          }}
                          className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Remplacer
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
                    <div className="text-center p-3 sm:p-4 md:p-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 mx-auto text-gray-400"
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
                    <div className="text-center p-3 sm:p-4 md:p-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 mx-auto text-gray-400"
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nom
                    </p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      {selectedDocument.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Date de téléversement
                      </p>
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                        {selectedDocument.uploadDate}
                      </p>
                    </div>
                  )}

                  {selectedDocument.feedback && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Commentaire
                      </p>
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                        {selectedDocument.feedback}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Formats acceptés
                    </p>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      {selectedDocument.type?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedDocument.status === "not_uploaded" ? (
                <button
                  onClick={() => handleUpload(selectedDocument.id)}
                  className="w-full btn-primary py-1.5 sm:py-2 text-xs sm:text-sm md:text-base flex items-center justify-center"
                  disabled={uploadingDoc === selectedDocument.id}
                >
                  {uploadingDoc === selectedDocument.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Téléversement...
                    </>
                  ) : (
                    "Téléverser ce document"
                  )}
                </button>
              ) : (
                <div className="flex space-x-2 sm:space-x-3">
                  <button
                    onClick={() => {
                      const url = selectedDocument.fileUrl;
                      if (typeof url === "string") {
                        window.open(url, "_blank");
                      } else {
                        toast.error("Aucun fichier disponible");
                      }
                    }}
                    className="flex-1 btn-secondary py-1.5 sm:py-2 text-xs sm:text-sm"
                  >
                    Télécharger
                  </button>
                  <button
                    onClick={() => handleUpload(selectedDocument.id)}
                    className="flex-1 btn-primary py-1.5 sm:py-2 text-xs sm:text-sm"
                  >
                    Remplacer
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 md:py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 mx-auto text-gray-400"
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
              <h3 className="mt-2 text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white">
                Sélectionnez un document
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Cliquez sur un document pour voir ses détails
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Input file caché */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
  );
}
