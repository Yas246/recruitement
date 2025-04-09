"use client";

import ProgressBar from "@/app/components/ProgressBar";
import { useState } from "react";

interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
}

export default function WorkerProfile() {
  // Données factices pour simuler les étapes de progression
  const progressSteps = [
    { id: 1, name: "Informations personnelles", completed: true },
    { id: 2, name: "Documents requis", completed: true },
    { id: 3, name: "Candidature", completed: true },
    { id: 4, name: "Entretien", completed: false, active: true },
    { id: 5, name: "Décision finale", pending: true },
  ];

  const [activeTab, setActiveTab] = useState("personal");

  // État pour les compétences
  const [skills, setSkills] = useState<Skill[]>([
    { id: "s1", name: "JavaScript", level: 4 },
    { id: "s2", name: "React", level: 5 },
    { id: "s3", name: "Node.js", level: 3 },
    { id: "s4", name: "TypeScript", level: 4 },
    { id: "s5", name: "SQL", level: 3 },
  ]);

  // État pour les expériences professionnelles
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "e1",
      title: "Développeur Full Stack",
      company: "Tech Innovations",
      location: "Paris, France",
      startDate: "2020-05",
      endDate: null,
      description:
        "Développement d'applications web avec React, Node.js et PostgreSQL. Mise en place de CI/CD et déploiement sur AWS.",
      current: true,
    },
    {
      id: "e2",
      title: "Développeur Frontend",
      company: "Digital Agency",
      location: "Lyon, France",
      startDate: "2018-09",
      endDate: "2020-04",
      description:
        "Création d'interfaces utilisateur responsives avec React et Redux. Collaboration avec les designers UX/UI.",
      current: false,
    },
  ]);

  // État pour l'éducation
  const [education, setEducation] = useState<Education[]>([
    {
      id: "ed1",
      degree: "Master en Informatique",
      institution: "Université de Paris",
      location: "Paris, France",
      startDate: "2016-09",
      endDate: "2018-06",
      description:
        "Spécialisation en développement web et applications mobiles.",
      current: false,
    },
    {
      id: "ed2",
      degree: "Licence en Informatique",
      institution: "Université de Lyon",
      location: "Lyon, France",
      startDate: "2013-09",
      endDate: "2016-06",
      description:
        "Fondamentaux de l'informatique, algorithmes et programmation.",
      current: false,
    },
  ]);

  // Information personnelles (mock data)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    title: "Développeur Full Stack",
    location: "Paris, France",
    about:
      "Développeur passionné avec plus de 5 ans d'expérience dans la création d'applications web innovantes. Spécialisé en JavaScript et son écosystème, notamment React et Node.js.",
    linkedin: "linkedin.com/in/jeandupont",
    github: "github.com/jeandupont",
    website: "jeandupont.dev",
  });

  // Fonction pour ajouter une nouvelle compétence
  const addSkill = (skill: Skill) => {
    setSkills([...skills, skill]);
  };

  // Fonction pour supprimer une compétence
  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  // Fonction pour ajouter une nouvelle expérience
  const addExperience = (experience: Experience) => {
    setExperiences([experience, ...experiences]);
  };

  // Fonction pour mettre à jour une expérience
  const updateExperience = (updatedExperience: Experience) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === updatedExperience.id ? updatedExperience : exp
      )
    );
  };

  // Fonction pour supprimer une expérience
  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Mon Profil Professionnel
      </h1>

      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Progression de votre dossier
        </h2>
        <ProgressBar steps={progressSteps} />
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Votre dossier avance bien ! Complétez votre profil professionnel pour
          optimiser vos chances auprès des recruteurs.
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Onglets */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "personal"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Informations personnelles
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "experience"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("experience")}
          >
            Expérience professionnelle
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "education"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("education")}
          >
            Formation
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === "skills"
                ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            }`}
            onClick={() => setActiveTab("skills")}
          >
            Compétences
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {/* Onglet Informations personnelles */}
          {activeTab === "personal" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Informations personnelles
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Ces informations seront visibles par les recruteurs et
                partenaires d&apos;OMSHINA.
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.lastName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Titre professionnel
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.title}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Lieu
                    </label>
                    <input
                      type="text"
                      id="location"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.location}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    À propos
                  </label>
                  <textarea
                    id="about"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    value={personalInfo.about}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        about: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      id="linkedin"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.linkedin}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          linkedin: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="github"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      GitHub
                    </label>
                    <input
                      type="text"
                      id="github"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.github}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          github: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Site Web
                    </label>
                    <input
                      type="text"
                      id="website"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      value={personalInfo.website}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          website: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button type="submit" className="btn-primary">
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Onglet Expérience professionnelle */}
          {activeTab === "experience" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Expérience professionnelle
                </h3>
                <button className="btn-primary py-2 px-4">
                  Ajouter une expérience
                </button>
              </div>

              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {exp.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {exp.company} • {exp.location}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(exp.startDate).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                          })}{" "}
                          -
                          {exp.current
                            ? " Actuel"
                            : exp.endDate
                            ? " " +
                              new Date(exp.endDate).toLocaleDateString(
                                "fr-FR",
                                { year: "numeric", month: "long" }
                              )
                            : ""}
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                          {exp.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {experiences.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Vous n&apos;avez pas encore ajouté d&apos;expérience
                    professionnelle.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Onglet Formation */}
          {activeTab === "education" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Formation
                </h3>
                <button className="btn-primary py-2 px-4">
                  Ajouter une formation
                </button>
              </div>

              <div className="space-y-6">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {edu.degree}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {edu.institution} • {edu.location}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(edu.startDate).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                          })}{" "}
                          -
                          {edu.current
                            ? " Actuel"
                            : edu.endDate
                            ? " " +
                              new Date(edu.endDate).toLocaleDateString(
                                "fr-FR",
                                { year: "numeric", month: "long" }
                              )
                            : ""}
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                          {edu.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {education.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Vous n&apos;avez pas encore ajouté de formation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Onglet Compétences */}
          {activeTab === "skills" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Compétences
                </h3>
                <button className="btn-primary py-2 px-4">
                  Ajouter une compétence
                </button>
              </div>

              <div className="space-y-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </h4>
                      <div className="flex items-center mt-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-6 h-2 rounded-full mx-0.5 ${
                              level <= skill.level
                                ? "bg-primary-600 dark:bg-primary-400"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          ></div>
                        ))}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {skill.level}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {skills.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Vous n&apos;avez pas encore ajouté de compétences.
                  </p>
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Prévisualisation pour les recruteurs
                </h4>
                <div className="glass-card p-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded-full text-sm font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
