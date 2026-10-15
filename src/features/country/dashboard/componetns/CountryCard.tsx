// src/features/countries/components/CountryCard.tsx

import { getLocalizedName } from "@/shared/utils/localizeName";
import type { Country } from "../../model/types/country.types";
import type { TranslatedText } from "@/shared/types/types";


interface CountryCardProps {
  country: Country<TranslatedText>;
  currentAppLang: string;
  togglingId: number | string | null;
  onEdit: (country: Country<TranslatedText>) => void;
  onDelete: (id: number | string) => void;
  onToggleStatus: (id: number | string) => void;
}

export function CountryCard({
  country,
  currentAppLang,
  togglingId,
  onEdit,
  onDelete,
  onToggleStatus,
}: CountryCardProps) {
  const isTogglingThis = togglingId === country.id;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-base">
            {getLocalizedName(country.name, currentAppLang)}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Code: {country.code} | Phone: +{country.phone_code}
          </p>
        </div>

        {/* زر تغيير الحالة مع حالة التحميل الفردية */}
        <button
          disabled={isTogglingThis}
          onClick={() => onToggleStatus(country.id)}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
            country.is_active
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 hover:bg-emerald-100"
              : "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 hover:bg-rose-100"
          }`}
          title="Click to toggle status"
        >
          {isTogglingThis ? "..." : country.is_active ? "Active" : "Inactive"}
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-gray-700/50">
        <button
          onClick={() => onEdit(country)}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(country.id)}
          className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}