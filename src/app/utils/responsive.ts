"use client";

import { useEffect, useState } from "react";

// Définir les points de rupture standards pour notre application
export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type Breakpoint = keyof typeof breakpoints;

/**
 * Hook pour détecter si la fenêtre est plus petite qu'un point de rupture spécifié
 */
export function useBreakpointDown(breakpoint: Breakpoint): boolean {
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    // Gestionnaire de redimensionnement
    const handleResize = () => {
      setIsDown(window.innerWidth < breakpoints[breakpoint]);
    };

    // Définir l'état initial
    handleResize();

    // Ajouter l'écouteur d'événement
    window.addEventListener("resize", handleResize);

    // Nettoyer
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isDown;
}

/**
 * Hook pour détecter si la fenêtre est plus grande qu'un point de rupture spécifié
 */
export function useBreakpointUp(breakpoint: Breakpoint): boolean {
  const [isUp, setIsUp] = useState(false);

  useEffect(() => {
    // Gestionnaire de redimensionnement
    const handleResize = () => {
      setIsUp(window.innerWidth >= breakpoints[breakpoint]);
    };

    // Définir l'état initial
    handleResize();

    // Ajouter l'écouteur d'événement
    window.addEventListener("resize", handleResize);

    // Nettoyer
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isUp;
}

/**
 * Hook pour détecter si la fenêtre est entre deux points de rupture
 */
export function useBreakpointBetween(
  minBreakpoint: Breakpoint,
  maxBreakpoint: Breakpoint
): boolean {
  const [isBetween, setIsBetween] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsBetween(
        width >= breakpoints[minBreakpoint] &&
          width < breakpoints[maxBreakpoint]
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minBreakpoint, maxBreakpoint]);

  return isBetween;
}

/**
 * Hook personnalisé pour détecter si l'appareil est mobile en fonction de la largeur d'écran
 * @param breakpoint - La largeur en pixels en dessous de laquelle l'appareil est considéré comme mobile (défaut: 768px)
 * @returns boolean - True si l'appareil est considéré comme mobile
 */
export function useIsMobile(breakpoint: number = breakpoints.md): boolean {
  // Par défaut, nous partons du principe que nous ne sommes pas sur mobile
  // Cela évite les problèmes de correspondance client/serveur pour le SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fonction pour vérifier si la taille de l'écran est inférieure au point de rupture
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Vérification initiale
    checkIsMobile();

    // Ajout d'un écouteur d'événement pour le redimensionnement
    window.addEventListener("resize", checkIsMobile);

    // Nettoyage de l'écouteur
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]); // Exécuté à chaque fois que le point de rupture change

  return isMobile;
}

/**
 * Hook pour détecter si l'appareil est une tablette
 */
export function useIsTablet() {
  return useBreakpointBetween("sm", "lg");
}

/**
 * Hook pour détecter si l'appareil est un desktop
 */
export function useIsDesktop() {
  return useBreakpointUp("lg");
}

/**
 * Hook pour détecter si l'appareil a un petit écran (téléphone mobile)
 */
export function useIsSmallMobile() {
  return useBreakpointDown("xs");
}

/**
 * Hook personnalisé pour obtenir la taille actuelle de l'écran
 * @returns Object - Contenant la largeur et la hauteur de l'écran
 */
export function useWindowSize() {
  // Utilisation d'une valeur par défaut pour éviter les problèmes de SSR
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Fonction pour mettre à jour la taille de l'écran
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Mettre à jour la taille immédiatement
    handleResize();

    // Ajout d'un écouteur d'événement pour le redimensionnement
    window.addEventListener("resize", handleResize);

    // Nettoyage de l'écouteur
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook pour obtenir le breakpoint actuel en fonction de la largeur d'écran
 */
export function useCurrentBreakpoint(): Breakpoint {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) {
        setCurrentBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint("md");
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint("sm");
      } else {
        setCurrentBreakpoint("xs");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return currentBreakpoint;
}
