// src/features/countries/components/CountryStatsCards.tsx

import { Layers, CheckCircle2, XCircle } from "lucide-react";
import type { CountryStats } from "../../model/types/country.types";


interface CountryStatsCardsProps {
  stats: CountryStats;
}

export function CountryStatsCards({ stats }: CountryStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Countries</p>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stats.total ?? 0}</h4>
        </div>
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-xl flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Active</p>
          <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active ?? 0}</h4>
        </div>
        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Inactive</p>
          <h4 className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{stats.inactive ?? 0}</h4>
        </div>
        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-xl flex items-center justify-center">
          <XCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}