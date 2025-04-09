"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useState } from "react";

// Types pour les documents
interface Document {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "not_uploaded";
  uploadDate?: string;
  fileSize?: string;
  feedback?: string;
  required: boolean;
}

export default function ArtistDocuments() {
  // Données factices pour simuler les étapes de progression
  const progressSteps = [
    { id: 1, name: "Informations personnelles", completed: true },
    { id: 2, name: "Documents requis", completed: false, active: true },
    { id: 3, name: "Portfolio", completed: false },
    { id: 4, name: "Audition/Présentation", pending: true },
    { id: 5, name: "Décision finale", pending: true },
  ];

  // Documents requis pour la candidature artiste
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "cv",
      name: "Curriculum Vitae artistique",
      type: "pdf",
      status: "approved",
      uploadDate: "10/04/2023",
      fileSize: "540 KB",
      feedback: "Document validé",
      required: true,
    },
    {
      id: "id",
      name: "Pièce d'identité",
      type: "pdf,jpg,png",
      status: "pending",
      uploadDate: "12/04/2023",
      fileSize: "1.2 MB",
      required: true,
    },
    {
      id: "artistStatement",
      name: "Démarche artistique",
      type: "pdf",
      status: "rejected",
      uploadDate: "12/04/2023",
      fileSize: "850 KB",
      feedback:
        "Veuillez développer davantage votre démarche artistique et inclure vos influences principales.",
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
  ]);

  // État pour le document sélectionné (pour afficher les détails)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  // Gestion de l'upload factice d'un document
  const handleUpload = (docId: string) => {
    // Simulation d'upload
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "pending",
              uploadDate: new Date().toLocaleDateString(),
              fileSize: "1.1 MB",
            }
          : doc
      )
    );
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Documents
      </h1>

      <div className="mb-10">
        <ProgressBar steps={progressSteps} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des documents */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Documents requis
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Veuillez téléverser tous les documents requis pour compléter
                votre dossier artistique. Ces documents nous permettront de
                mieux comprendre votre travail et votre parcours.
              </p>
            </div>

            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-center">
                    {statusIcons[doc.status]}
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                        {doc.name}
                        {doc.required && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Requis
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                          handleUpload(doc.id);
                        }}
                        className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Téléverser
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
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
        <div className="glass-card p-6">
          {selectedDocument ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Détails du document
              </h2>

              <div className="mb-6">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  {selectedDocument.status === "not_uploaded" ? (
                    <div className="text-center p-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
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
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Aucun document téléversé
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nom
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedDocument.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Statut
                    </p>
                    <p className="font-medium">
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Date de téléversement
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedDocument.uploadDate}
                      </p>
                    </div>
                  )}

                  {selectedDocument.feedback && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Commentaire
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedDocument.feedback}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Formats acceptés
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedDocument.type.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedDocument.status === "not_uploaded" ? (
                <button
                  onClick={() => handleUpload(selectedDocument.id)}
                  className="w-full btn-primary py-2"
                >
                  Téléverser ce document
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button className="flex-1 btn-secondary py-2">
                    Télécharger
                  </button>
                  <button className="flex-1 btn-primary py-2">Remplacer</button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <h3 className="mt-4 font-medium text-gray-900 dark:text-white">
                Sélectionnez un document
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                Cliquez sur un document dans la liste pour voir ses détails et
                le gérer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
