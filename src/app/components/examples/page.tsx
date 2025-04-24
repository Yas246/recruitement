import Link from "next/link";
import ProgressBarExample from "../ProgressBarExample";

export default function ComponentExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Exemples de Composants
            </h1>
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              ProgressBar
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Un composant réutilisable pour afficher les étapes de progression
              dans un processus.
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <ProgressBarExample />
          </div>

          <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Utilisation
            </h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <pre className="text-sm text-gray-800 dark:text-gray-300 overflow-x-auto">
                {`import { ProgressBar } from '@/app/components/ProgressBar';
import { ProgressStep } from '@/app/types/common';

// Définir les étapes
const steps: ProgressStep[] = [
  { id: 1, name: "Étape 1", completed: true },
  { id: 2, name: "Étape 2", active: true },
  { id: 3, name: "Étape 3", pending: true },
];

// Utilisation basique
<ProgressBar steps={steps} />

// Avec des options supplémentaires
<ProgressBar 
  steps={steps} 
  showPercentage={true}
  variant="compact"
  size="medium"
  customColors={{
    completed: "bg-blue-100 text-blue-600 border-blue-500",
    active: "bg-pink-100 text-pink-600 border-pink-500",
  }}
/>
`}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
