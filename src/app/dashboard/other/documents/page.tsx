"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useState } from "react";

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

export default function OtherDocuments() {
  // Steps for the progress bar
  const progressSteps = [
    {
      id: 1,
      name: "Informations personnelles",
      completed: true,
    },
    {
      id: 2,
      name: "Documents requis",
      completed: false,
      active: true,
    },
    {
      id: 3,
      name: "Candidature",
      pending: false,
    },
    {
      id: 4,
      name: "Entretien",
      pending: false,
    },
    {
      id: 5,
      name: "Décision finale",
      pending: false,
    },
  ];

  // Documents list with their status
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Carte d'identité ou Passeport",
      type: "identity",
      status: "approved",
      uploadDate: "15/05/2023",
      fileSize: "2.4 MB",
      required: true,
    },
    {
      id: "2",
      name: "CV / Résumé",
      type: "cv",
      status: "pending",
      uploadDate: "16/05/2023",
      fileSize: "1.8 MB",
      required: true,
    },
    {
      id: "3",
      name: "Lettre de motivation ou projet professionnel",
      type: "letter",
      status: "rejected",
      uploadDate: "16/05/2023",
      fileSize: "1.2 MB",
      feedback:
        "Votre lettre doit détailler davantage votre projet et vos objectifs spécifiques.",
      required: true,
    },
    {
      id: "4",
      name: "Justificatif de domicile",
      type: "address",
      status: "not_uploaded",
      required: true,
    },
    {
      id: "5",
      name: "Diplômes ou certificats",
      type: "diploma",
      status: "pending",
      uploadDate: "18/05/2023",
      fileSize: "3.6 MB",
      required: true,
    },
    {
      id: "6",
      name: "Portfolio ou exemples de travaux",
      type: "portfolio",
      status: "not_uploaded",
      required: false,
    },
    {
      id: "7",
      name: "Attestations ou références",
      type: "reference",
      status: "not_uploaded",
      required: false,
    },
  ]);

  // Selected document to display details
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Function to handle document upload (simulated)
  const handleUpload = (docId: string) => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;

    setDocuments(
      documents.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            status: "pending",
            uploadDate: formattedDate,
            fileSize: "2.1 MB", // Fake file size
          };
        }
        return doc;
      })
    );
  };

  // Status icons mapping
  const statusIcons = {
    pending: (
      <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center justify-center">
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
      <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    rejected: (
      <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    not_uploaded: (
      <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Mes Documents
      </h1>

      {/* Progress bar */}
      <div className="glass-card p-6 mb-8">
        <ProgressBar steps={progressSteps} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Documents list */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Documents requis
            </h2>

            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`border ${
                    doc.status === "rejected"
                      ? "border-red-300 dark:border-red-700"
                      : "border-gray-200 dark:border-gray-700"
                  } rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {statusIcons[doc.status]}
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {doc.name}{" "}
                          {doc.required && (
                            <span className="text-red-600 dark:text-red-400">
                              *
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {doc.status === "approved" && "Approuvé"}
                          {doc.status === "pending" &&
                            "En attente de validation"}
                          {doc.status === "rejected" && "Refusé"}
                          {doc.status === "not_uploaded" && "À téléverser"}
                          {doc.uploadDate &&
                            ` • Téléversé le ${doc.uploadDate}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {doc.status === "not_uploaded" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpload(doc.id);
                          }}
                          className="btn-primary text-sm py-1 px-3"
                        >
                          Téléverser
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Implement download logic here
                            }}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Implement replace logic here
                              handleUpload(doc.id);
                            }}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>* Documents obligatoires</p>
            </div>
          </div>
        </div>

        {/* Document details */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            {selectedDoc ? (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Détails du document
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nom
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedDoc.name}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Statut
                    </h3>
                    <p
                      className={`mt-1 ${
                        selectedDoc.status === "approved"
                          ? "text-green-600 dark:text-green-400"
                          : selectedDoc.status === "rejected"
                          ? "text-red-600 dark:text-red-400"
                          : selectedDoc.status === "pending"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {selectedDoc.status === "approved" && "Approuvé"}
                      {selectedDoc.status === "pending" &&
                        "En attente de validation"}
                      {selectedDoc.status === "rejected" && "Refusé"}
                      {selectedDoc.status === "not_uploaded" && "À téléverser"}
                    </p>
                  </div>

                  {selectedDoc.uploadDate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date de téléversement
                      </h3>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {selectedDoc.uploadDate}
                      </p>
                    </div>
                  )}

                  {selectedDoc.fileSize && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Taille du fichier
                      </h3>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {selectedDoc.fileSize}
                      </p>
                    </div>
                  )}

                  {selectedDoc.feedback && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Commentaire
                      </h3>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {selectedDoc.feedback}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                    {selectedDoc.status === "not_uploaded" ? (
                      <button
                        onClick={() => handleUpload(selectedDoc.id)}
                        className="btn-primary w-full"
                      >
                        Téléverser
                      </button>
                    ) : (
                      <>
                        <button className="btn-secondary w-full">
                          Télécharger
                        </button>
                        <button
                          onClick={() => handleUpload(selectedDoc.id)}
                          className="btn-primary w-full"
                        >
                          Remplacer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  Sélectionnez un document
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Cliquez sur un document pour voir ses détails
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
