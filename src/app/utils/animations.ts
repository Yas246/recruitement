import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  // Animer les éléments avec la classe fade-in
  gsap.utils.toArray(".fade-in").forEach((element: any) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animation des statistiques
  gsap.utils.toArray(".stat-number").forEach((element: any) => {
    gsap.fromTo(
      element,
      { textContent: 0 },
      {
        textContent: element.getAttribute("data-value"),
        duration: 2,
        ease: "power1.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};
