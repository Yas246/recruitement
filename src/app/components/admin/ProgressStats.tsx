"use client";

interface ProgressStatsProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  description?: string;
}

export function ProgressStats({
  title,
  current,
  target,
  unit = "",
  description,
}: ProgressStatsProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const progressColor =
    percentage >= 75
      ? "bg-green-500"
      : percentage >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {current}
          {unit}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          sur {target}
          {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`${progressColor} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 text-right">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
