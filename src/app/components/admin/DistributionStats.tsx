"use client";

interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

interface DistributionStatsProps {
  title: string;
  items: DistributionItem[];
  total: number;
  description?: string;
}

export function DistributionStats({
  title,
  items,
  total,
  description,
}: DistributionStatsProps) {
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
      <div className="space-y-4">
        {items.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {item.value} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
