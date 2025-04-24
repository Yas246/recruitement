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
 * Hook qui vérifie si l'écran est en mode mobile
 * @param breakpoint Taille en pixels en dessous de laquelle l'écran est considéré comme mobile (768px par défaut)
 * @returns boolean indiquant si l'écran est en mode mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérification initiale
    checkIsMobile();

    // Écouteur pour les changements de taille d'écran
    window.addEventListener("resize", checkIsMobile);

    // Nettoyage
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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
 * Hook qui retourne la taille de la fenêtre
 * @returns Object contenant width et height de la fenêtre
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // S'assurer que useState est mis à jour immédiatement
    if (typeof window !== "undefined") {
      handleResize();
    }

    // Ajouter un écouteur pour redimensionner
    window.addEventListener("resize", handleResize);

    // Nettoyer l'écouteur lors du démontage
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
