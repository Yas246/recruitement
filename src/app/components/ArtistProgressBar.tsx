"use client";

import { FirestoreDocument, firestoreService } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProgressBar from "./ProgressBar";

interface ProgressStep {
  id: number;
  name: string;
  completed: boolean;
  active?: boolean;
  pending?: boolean;
}

interface ApplicationProgress extends Record<string, unknown> {
  currentStep: number;
  steps: ProgressStep[];
}

type ArtistProfile = FirestoreDocument & {
  applicationProgress?: {
    currentStep: number;
    steps: Array<{
      id: number;
      name: string;
      completed: boolean;
      active?: boolean;
      pending?: boolean;
    }>;
  };
};

interface ArtistProgressBarProps {
  showPercentage?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export default function ArtistProgressBar({
  showPercentage = false,
  size = "medium",
  variant = "default",
  className = "",
}: ArtistProgressBarProps) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ApplicationProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const artistProfile = await firestoreService.getDocument<ArtistProfile>(
          "artists",
          user.uid
        );

        if (artistProfile?.applicationProgress) {
          setProgress(artistProfile.applicationProgress);
        }
      } catch (error) {
        console.error("Error loading artist progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  // Mettre à jour les étapes avec l'état actif basé sur currentStep
  const stepsWithActive = progress.steps.map((step) => ({
    ...step,
    active: step.id === progress.currentStep,
    pending: step.id > progress.currentStep && !step.completed,
  }));

  return (
    <div>
      <ProgressBar
        steps={stepsWithActive}
        showPercentage={showPercentage}
        size={size}
        variant={variant}
        className={className}
      />
    </div>
  );
}
