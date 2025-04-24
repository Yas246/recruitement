import { useAuth } from "@/app/contexts/AuthContext";
import { ProgressStep } from "@/app/types/common";
import { firestoreService } from "@/firebase";
import { useEffect, useState } from "react";

const defaultSteps: ProgressStep[] = [
  { id: 1, name: "Informations personnelles", completed: false },
  { id: 2, name: "Documents requis", completed: false },
  { id: 3, name: "Candidature", completed: false },
  { id: 4, name: "Entretien", pending: true },
  { id: 5, name: "Décision finale", pending: true },
];

export function useWorkerProgress() {
  const { user } = useAuth();
  const [steps, setSteps] = useState<ProgressStep[]>(defaultSteps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const workerDoc = await firestoreService.getDocument(
          "workers",
          user.uid
        );

        if (workerDoc?.applicationProgress) {
          const progress = workerDoc.applicationProgress as {
            steps: ProgressStep[];
          };
          if (progress.steps) {
            setSteps(progress.steps);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la progression:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user?.uid]);

  const updateProgress = async (newSteps: ProgressStep[]) => {
    if (!user?.uid) return;

    try {
      await firestoreService.updateDocument("workers", user.uid, {
        applicationProgress: {
          currentStep: newSteps.filter((step) => step.completed).length + 1,
          steps: newSteps,
        },
      });
      setSteps(newSteps);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression:", error);
      throw error;
    }
  };

  return {
    steps,
    loading,
    updateProgress,
  };
}
