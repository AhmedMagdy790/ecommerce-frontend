// src/features/countries/components/CountryEmptyState.tsx

import { Globe } from "lucide-react";

interface CountryEmptyStateProps {
  openCreateModal: () => void;
}

export function CountryEmptyState({ openCreateModal }: CountryEmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 space-y-3">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
        <Globe className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No countries found</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        Start by adding countries to manage shipping regions and addresses.
      </p>
      <button
        onClick={openCreateModal}
        className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium text-sm cursor-pointer"
      >
        Add First Country
      </button>
    </div>
  );
}