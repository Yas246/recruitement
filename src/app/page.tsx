"use client";

import { initAnimations } from "@/app/utils/animations";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Header from "./components/Header";

export default function Home() {
  useEffect(() => {
    initAnimations();

    gsap.fromTo(
      ".hero-content",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[90vh] sm:h-screen">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
          alt="OMSHINA International"
          fill
          className="object-cover brightness-[0.85] dark:brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black/30 dark:to-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white p-4 sm:p-8 hero-content max-w-md sm:max-w-2xl lg:max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-primary-400 dark:text-primary-500">
              L&apos;international au service de votre réussite
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-8">
              Bienvenue sur OMSHINA International Recruitment, votre portail de
              référence pour le recrutement international des étudiants,
              travailleurs, artistes et talents. Nous vous accompagnons à chaque
              étape pour concrétiser vos ambitions à l&apos;étranger, en vous
              offrant des services personnalisés et une expertise complète.
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-8">
              Rejoignez-nous et ouvrez les portes de votre avenir international
              !
            </p>
            <Link
              href="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-colors text-sm sm:text-base inline-block"
            >
              Commencer votre projet
            </Link>
          </div>
        </div>
      </section>

      {/* Présentation Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center fade-in">
            <div className="glass-card p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-50">
                Présentation générale
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
                OMSHINA International Recruitment est une plateforme dédiée à
                faciliter la mobilité internationale des étudiants,
                travailleurs, artistes et talents. Nous mettons notre expertise
                au service de votre réussite pour vous accompagner dans vos
                démarches administratives, la constitution de dossiers et
                l&apos;intégration à l&apos;étranger.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300">
                Grâce à un réseau de partenaires internationaux et à une
                connaissance approfondie des réglementations, nous offrons des
                solutions sur mesure adaptées à chaque profil.
              </p>
            </div>
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                alt="Notre expertise"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center fade-in text-gray-900 dark:text-gray-50">
            Nos Services
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 fade-in">
            {/* Étudiants */}
            <div className="glass-card overflow-hidden">
              <div className="relative h-40 sm:h-48">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                  alt="Services pour étudiants"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-50">
                  Recrutement des Étudiants
                </h3>
                <h4 className="font-semibold mb-1 sm:mb-2 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  Pourquoi partir étudier à l&apos;étranger ?
                </h4>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                  Étudier à l&apos;étranger offre une opportunité unique
                  d&apos;acquérir des compétences internationales, de découvrir
                  de nouvelles cultures et de bénéficier d&apos;une éducation de
                  qualité reconnue mondialement.
                </p>
                <h4 className="font-semibold mb-1 sm:mb-2 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  Notre accompagnement
                </h4>
                <ul className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1 sm:space-y-2">
                  <li>Orientation et conseils personnalisés</li>
                  <li>Préparation de dossier</li>
                  <li>Soumission et suivi des candidatures</li>
                  <li>Aide à l&apos;obtention du visa</li>
                  <li>Relocalisation</li>
                </ul>
              </div>
            </div>

            {/* Travailleurs */}
            <div className="glass-card overflow-hidden">
              <div className="relative h-40 sm:h-48">
                <Image
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop"
                  alt="Services pour travailleurs"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-50">
                  Recrutement des Travailleurs
                </h3>
                <h4 className="font-semibold mb-1 sm:mb-2 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  Pourquoi travailler à l&apos;étranger ?
                </h4>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                  L&apos;expérience professionnelle internationale permet de
                  diversifier ses compétences, de développer une expertise
                  interculturelle et d&apos;accéder à des opportunités
                  économiques attractives.
                </p>
                <h4 className="font-semibold mb-1 sm:mb-2 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  Nos services
                </h4>
                <ul className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1 sm:space-y-2">
                  <li>Recherche d&apos;opportunités</li>
                  <li>Optimisation de la candidature</li>
                  <li>Préparation aux entretiens</li>
                  <li>Aide au permis de travail</li>
                  <li>Soutien à l&apos;installation</li>
                </ul>
              </div>
            </div>

            {/* Artistes */}
            <div className="glass-card overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="relative h-40 sm:h-48">
                <Image
                  src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop"
                  alt="Services pour artistes"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-50">
                  Recrutement des Artistes et Talents
                </h3>
                <h4 className="font-semibold mb-1 sm:mb-2 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  Pourquoi participer à des projets internationaux ?
                </h4>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                  Les échanges culturels permettent aux artistes et talents de
                  se faire connaître sur la scène internationale, de collaborer
                  avec d&apos;autres créateurs et de contribuer au rayonnement
                  culturel.
                </p>
                <h4 className="font-semibold mb-1 sm:mb-2 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  Notre offre
                </h4>
                <ul className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1 sm:space-y-2">
                  <li>Accompagnement stratégique</li>
                  <li>Aide à la création de portfolio</li>
                  <li>Support administratif</li>
                  <li>Organisation logistique</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="glass-card p-6 sm:p-8 md:p-12 fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-50">
              Prêt à commencer votre aventure internationale ?
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Contactez-nous dès aujourd&apos;hui pour discuter de votre projet
              et découvrir comment nous pouvons vous accompagner.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-medium transition-colors"
            >
              Commencer votre projet
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-header py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2025 OMSHINA International - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
