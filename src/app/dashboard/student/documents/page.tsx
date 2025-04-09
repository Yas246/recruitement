"use client";

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

export default function StudentDocuments() {
  // Documents requis pour la candidature étudiant
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "cv",
      name: "Curriculum Vitae",
      type: "pdf",
      status: "approved",
      uploadDate: "10/04/2023",
      fileSize: "540 KB",
      feedback: "Document validé",
      required: true,
    },
    {
      id: "diploma",
      name: "Diplôme / Attestation de réussite",
      type: "pdf,jpg,png",
      status: "pending",
      uploadDate: "12/04/2023",
      fileSize: "1.2 MB",
      required: true,
    },
    {
      id: "transcript",
      name: "Relevés de notes",
      type: "pdf",
      status: "rejected",
      uploadDate: "12/04/2023",
      fileSize: "850 KB",
      feedback:
        "Document incomplet. Veuillez fournir tous les relevés des 3 dernières années.",
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
      name: "Passeport / Pièce d&apos;identité",
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
    pending: (
      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Mes Documents
      </h1>

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
                votre dossier de candidature.
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
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Aperçu du document
                      </p>
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
            <div className="text-center py-10">
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
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                Sélectionnez un document
              </h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Cliquez sur un document pour voir ses détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
