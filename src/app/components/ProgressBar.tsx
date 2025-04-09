"use client";

interface ProgressStep {
  id: number;
  name: string;
  completed?: boolean;
  pending?: boolean;
  active?: boolean;
}

interface ProgressBarProps {
  steps: ProgressStep[];
}

export default function ProgressBar({ steps }: ProgressBarProps) {
  return (
    <div className="relative py-8">
      <div className="absolute inset-0 flex" style={{ top: "53%" }}>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div
        className="relative grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
      >
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${
                step.completed
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-2 border-green-500 dark:border-green-400"
                  : step.active
                  ? "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 border-2 border-primary-500 dark:border-primary-400 ring-4 ring-primary-500/30 dark:ring-primary-400/20"
                  : step.pending
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-2 border-amber-500 dark:border-amber-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600"
              } mb-3 z-10 shadow-sm`}
            >
              {step.completed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : step.active ? (
                <span className="font-bold">{step.id}</span>
              ) : step.pending ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <span className="font-semibold">{step.id}</span>
              )}
            </div>
            <span
              className={`text-sm font-medium text-center ${
                step.active
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300"
              } mt-1`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
