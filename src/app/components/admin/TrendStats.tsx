"use client";

interface TrendStatsProps {
  title: string;
  value: number;
  change: number;
  unit?: string;
  description?: string;
}

export function TrendStats({
  title,
  value,
  change,
  unit = "",
  description,
}: TrendStatsProps) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? "text-green-500" : "text-red-500";
  const changeIcon = isPositive ? "↑" : "↓";

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
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
          {unit}
        </span>
        <div className={`flex items-center ${changeColor}`}>
          <span className="text-sm font-medium mr-1">
            {changeIcon} {Math.abs(change)}%
          </span>
        </div>
      </div>
    </div>
  );
}
