"use client";

import { useWorkerProgress } from "../hooks/useWorkerProgress";
import ProgressBar from "./ProgressBar";

interface WorkerProgressBarProps {
  showPercentage?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export default function WorkerProgressBar({
  showPercentage = true,
  size = "medium",
  variant = "default",
  className = "",
}: WorkerProgressBarProps) {
  const { steps, loading } = useWorkerProgress();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <ProgressBar
      steps={steps}
      showPercentage={showPercentage}
      size={size}
      variant={variant}
      className={className}
    />
  );
}
