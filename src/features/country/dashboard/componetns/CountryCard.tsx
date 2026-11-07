// src/features/countries/components/CountryCard.tsx

import {
  Check,
  Pencil,
  Trash2,
  Phone,
  Globe2,
} from "lucide-react";

import { getLocalizedName } from "@/shared/utils/localizeName";
import type { Country } from "../../model/types/country.types";
import type { TranslatedText } from "@/shared/types/types";

interface CountryCardProps {
  country: Country<TranslatedText>;
  currentAppLang: string;
  togglingId: number | string | null;
  isSelected: boolean;
  onSelect: (id: number | string) => void;
  onEdit: (country: Country<TranslatedText>) => void;
  onDelete: (id: number | string) => void;
  onToggleStatus: (id: number | string) => void;
}

export function CountryCard({
  country,
  currentAppLang,
  togglingId,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus,
}: CountryCardProps) {
  const isTogglingThis = togglingId === country.id;
  const countryName = getLocalizedName(
    country.name,
    currentAppLang
  );

  const isActive = Boolean(country.is_active);

  return (
    <article
      className={`
        group relative overflow-hidden rounded-2xl border
        bg-white dark:bg-gray-900
        transition-all duration-200
        ${
          isSelected
            ? "border-primary ring-2 ring-primary/15 shadow-sm"
            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg hover:shadow-gray-200/40 dark:hover:shadow-black/20"
        }
      `}
    >
      {/* Top Header Controls: Checkbox + Status */}
      <div className="flex items-center justify-between p-4 pb-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={isSelected}
          aria-label={`Select ${countryName}`}
          onClick={() => onSelect(country.id)}
          className={`
            flex size-5 shrink-0 items-center justify-center
            rounded-md border transition-all
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-primary focus-visible:ring-offset-2
            ${
              isSelected
                ? "border-primary bg-primary text-white"
                : "border-gray-300 bg-white hover:border-primary dark:border-gray-600 dark:bg-gray-800"
            }
          `}
        >
          {isSelected && <Check size={13} strokeWidth={3} />}
        </button>

        {/* Status button */}
        <button
          type="button"
          disabled={isTogglingThis}
          onClick={() => onToggleStatus(country.id)}
          aria-label={`Change ${countryName} status`}
          className={`
            inline-flex shrink-0 items-center gap-1.5
            rounded-full border px-2.5 py-1
            text-xs font-medium transition-colors
            disabled:cursor-not-allowed disabled:opacity-50
            ${
              isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
            }
          `}
        >
          <span
            className={`size-1.5 rounded-full ${
              isActive ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
          {isTogglingThis
            ? "Updating..."
            : isActive
              ? "Active"
              : "Inactive"}
        </button>
      </div>

      {/* Main Content: Country Name and Details */}
      <div className="min-h-[100px] px-4 pb-4">
        <div className="flex items-center gap-2">
          <Globe2
            size={18}
            className="shrink-0 text-gray-400"
          />

          <h3
            className="truncate text-[12px] font-semibold text-gray-900 dark:text-white"
            title={countryName}
          >
            {countryName}
          </h3>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {country.code}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Phone size={12} />
            +{country.phone_code}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* Bottom Actions */}
      <div className="flex items-center justify-end px-4 py-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(country)}
            aria-label={`Edit ${countryName}`}
            title="Edit country"
            className="
              flex size-8 items-center justify-center rounded-lg
              text-gray-500 transition-colors
              hover:bg-gray-100 hover:text-gray-900
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
              dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white
            "
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(country.id)}
            aria-label={`Delete ${countryName}`}
            title="Delete country"
            className="
              flex size-8 items-center justify-center rounded-lg
              text-rose-500 transition-colors
              hover:bg-rose-50 hover:text-rose-700
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
              dark:hover:bg-rose-950/40 dark:hover:text-rose-400
            "
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}