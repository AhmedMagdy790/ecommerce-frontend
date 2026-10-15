// src/pages/Shop/components/ShopFilters/ResetFilters.tsx

import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface ResetFiltersProps {
  activeFiltersCount: number;
  onReset: () => void;
}

export default function ResetFilters({
  activeFiltersCount,
  onReset,
}: ResetFiltersProps) {
  const { t } = useTranslation("shop");
  const { lang } = useLang();

  if (activeFiltersCount === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onReset}
      className="inline-flex items-center gap-[var(--spacing-1.5)] text-[var(--text-xs)] font-[var(--font-medium)] text-red-500 transition-colors hover:text-red-600"
    >
      <X size={14} />

      <span>
        {t("filters.reset", {
          defaultValue: lang === "ar"
            ? "إعادة ضبط الكل"
            : "Reset All",
        })}
      </span>
    </button>
  );
}