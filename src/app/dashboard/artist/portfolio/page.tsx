"use client";

import Image from "next/image";
import { useState } from "react";

// Type pour les œuvres du portfolio
interface Artwork {
  id: string;
  title: string;
  description: string;
  medium: string;
  year: string;
  images: string[];
  featured: boolean;
  category:
    | "digital"
    | "painting"
    | "photography"
    | "sculpture"
    | "installation"
    | "performance"
    | "video";
}

export default function ArtistPortfolio() {
  // État pour la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // État pour l'œuvre sélectionnée (détails)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Données fictives pour les œuvres d'art
  const artworks: Artwork[] = [
    {
      id: "1",
      title: "Fragments de mémoire",
      description:
        "Une série d'installations numériques explorant les thèmes de la mémoire et de l'identité à travers des projections interactives.",
      medium: "Installation numérique interactive",
      year: "2022",
      images: [
        "https://images.unsplash.com/photo-1581343109297-b0723170dc42?q=80&w=2070",
        "https://images.unsplash.com/photo-1642302959992-75900bee4fc5?q=80&w=2070",
      ],
      featured: true,
      category: "installation",
    },
    {
      id: "2",
      title: "Échos urbains",
      description:
        "Série photographique capturant l'intersection entre l'environnement urbain et la nature, révélant des moments de coexistence inattendue.",
      medium: "Photographie numérique, tirage fine art",
      year: "2021",
      images: [
        "https://images.unsplash.com/photo-1592372554345-33c4e108fb34?q=80&w=2069",
        "https://images.unsplash.com/photo-1558865869-c93f6f8482af?q=80&w=2081",
      ],
      featured: true,
      category: "photography",
    },
    {
      id: "3",
      title: "Flux de conscience",
      description:
        "Une exploration abstraite des états émotionnels à travers des formes et couleurs fluides, interrogeant la frontière entre le conscient et l'inconscient.",
      medium: "Acrylique sur toile",
      year: "2020",
      images: [
        "https://images.unsplash.com/photo-1536924430914-91f9e2041b83?q=80&w=2066",
      ],
      featured: false,
      category: "painting",
    },
    {
      id: "4",
      title: "Limites numériques",
      description:
        "Série d'œuvres numériques explorant les limites entre le physique et le virtuel dans notre société contemporaine.",
      medium: "Art numérique, impression sur aluminium",
      year: "2023",
      images: [
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1974",
        "https://images.unsplash.com/photo-1633354996357-4d8c211f2748?q=80&w=1932",
      ],
      featured: true,
      category: "digital",
    },
    {
      id: "5",
      title: "Espaces transitoires",
      description:
        "Performance explorant les thèmes du déplacement et des frontières à travers le mouvement et l'interaction avec l'espace public.",
      medium: "Performance, vidéo HD",
      year: "2022",
      images: [
        "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?q=80&w=2070",
      ],
      featured: false,
      category: "performance",
    },
  ];

  // Catégories disponibles
  const categories = [
    { id: "all", label: "Tous" },
    { id: "digital", label: "Art numérique" },
    { id: "painting", label: "Peinture" },
    { id: "photography", label: "Photographie" },
    { id: "sculpture", label: "Sculpture" },
    { id: "installation", label: "Installation" },
    { id: "performance", label: "Performance" },
    { id: "video", label: "Vidéo" },
  ];

  // Filtrer les œuvres en fonction de la catégorie sélectionnée
  const filteredArtworks =
    selectedCategory === "all"
      ? artworks
      : artworks.filter((artwork) => artwork.category === selectedCategory);

  // Ajout d'une nouvelle œuvre (factice)
  const addNewArtwork = () => {
    // Dans une vraie application, cette fonction ouvrirait un formulaire
    alert("Fonctionnalité à implémenter : Formulaire d'ajout d'œuvre");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mon Portfolio
        </h1>
        <button
          onClick={addNewArtwork}
          className="btn-primary flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Ajouter une œuvre
        </button>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex overflow-x-auto pb-4 mb-6">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {selectedArtwork ? (
        // Vue détaillée d'une œuvre
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedArtwork.title}
            </h2>
            <button
              onClick={() => setSelectedArtwork(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
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
            </button>
          </div>

          {/* Galerie d'images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {selectedArtwork.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${selectedArtwork.title} - image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedArtwork.description}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Technique
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedArtwork.medium}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Année
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedArtwork.year}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Catégorie
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {
                    categories.find((c) => c.id === selectedArtwork.category)
                      ?.label
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mt-8">
            <button className="btn-secondary py-2 px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 inline"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Modifier
            </button>
            {selectedArtwork.featured ? (
              <button className="btn-secondary py-2 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 inline text-amber-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Retirer des favoris
              </button>
            ) : (
              <button className="btn-secondary py-2 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 inline"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Ajouter aux favoris
              </button>
            )}
            <button className="btn-secondary py-2 px-4 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 inline"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        // Vue grille des œuvres
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="glass-card overflow-hidden group cursor-pointer"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="relative aspect-video">
                <Image
                  src={artwork.images[0]}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {artwork.featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {artwork.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {artwork.medium}, {artwork.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
