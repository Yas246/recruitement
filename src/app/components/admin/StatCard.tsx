"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend: {
    value: number;
    label: string;
  };
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  const isPositive = trend.value > 0;

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon
              className="h-6 w-6 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <div className="text-sm">
          <div className="flex items-center text-sm">
            {isPositive ? (
              <ArrowUpIcon
                className="self-center flex-shrink-0 h-5 w-5 text-green-500"
                aria-hidden="true"
              />
            ) : (
              <ArrowDownIcon
                className="self-center flex-shrink-0 h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            )}
            <span
              className={`ml-1 font-medium ${
                isPositive
                  ? "text-green-600 dark:text-green-500"
                  : "text-red-600 dark:text-red-500"
              }`}
            >
              {Math.abs(trend.value)}%
            </span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {trend.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
