// src/pages/Shop/components/PriceFilter.tsx

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface PriceFilterProps {
  isOpen: boolean;
  onToggleOpen: () => void;

  defaultMin: number;
  defaultMax: number;

  value: {
    min: string;
    max: string;
  };

  onChange: (value: { min: string; max: string }) => void;
}

export default function PriceFilter({
  isOpen,
  onToggleOpen,
  defaultMin,
  defaultMax,
  value,
  onChange,
}: PriceFilterProps) {
  const { t } = useTranslation("shop");
  const { lang } = useLang();

  const [minPrice, setMinPrice] = useState(value.min);
  const [maxPrice, setMaxPrice] = useState(value.max);

  useEffect(() => {
    setMinPrice(value.min);
    setMaxPrice(value.max);
  }, [value]);

  const handleApply = () => {
    onChange({
      min: minPrice,
      max: maxPrice,
    });
    onToggleOpen();
  };

  const handleRangePreset = (min: number, max: number) => {
    setMinPrice(String(min));
    setMaxPrice(String(max));
    onChange({
      min: String(min),
      max: String(max),
    });
    onToggleOpen();
  };

  const hasFilter = value.min !== "" || value.max !== "";

  // Quick price range presets
  const presets = [
    { label: { ar: "أقل من 50$", en: "Under $50" }, min: 0, max: 50 },
    { label: { ar: "50$ - 200$", en: "$50 - $200" }, min: 50, max: 200 },
    { label: { ar: "200$ - 500$", en: "$200 - $500" }, min: 200, max: 500 },
    { label: { ar: "أكثر من 500$", en: "Over $500" }, min: 500, max: defaultMax },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggleOpen}
        className="inline-flex items-center gap-[var(--spacing-2)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-background)] px-[var(--spacing-4)] py-[var(--spacing-2.5)] text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)] cursor-pointer"
      >
        <span>
          {t("filters.price", {
            defaultValue:
              lang === "ar" ? "نطاق السعر" : "Price Range",
          })}
        </span>

        {hasFilter && (
          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        )}

        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute start-0 top-full z-50 mt-2 w-72 space-y-[var(--spacing-4)] rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--spacing-4)] shadow-xl">
          
          {/* Quick Range Presets Grid */}
          <div className="grid grid-cols-2 gap-[var(--spacing-2)] pb-[var(--spacing-3)] border-b border-[var(--color-border)]">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRangePreset(preset.min, preset.max)}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] py-1.5 px-2 text-[11px] font-[var(--font-medium)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer text-center"
              >
                {preset.label[lang as keyof typeof preset.label] || preset.label.en}
              </button>
            ))}
          </div>

          {/* Custom Min / Max Inputs */}
          <div className="flex items-center gap-[var(--spacing-2)]">
            <div className="relative w-full">
              <span className="absolute inset-y-0 start-3 flex items-center text-xs text-[var(--color-text-muted)]">
                $
              </span>

              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder={String(defaultMin)}
                className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-background)] py-[var(--spacing-2)] pe-[var(--spacing-3)] ps-6 text-[var(--text-sm)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <span className="text-[var(--color-text-muted)]">-</span>

            <div className="relative w-full">
              <span className="absolute inset-y-0 start-3 flex items-center text-xs text-[var(--color-text-muted)]">
                $
              </span>

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={String(defaultMax)}
                className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-background)] py-[var(--spacing-2)] pe-[var(--spacing-3)] ps-6 text-[var(--text-sm)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-[var(--radius-xl)] bg-[var(--color-primary)] py-2.5 text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-text-inverse)] transition-opacity hover:opacity-90 cursor-pointer shadow-md"
          >
            {t("filters.apply", {
              defaultValue: lang === "ar" ? "تطبيق" : "Apply",
            })}
          </button>
        </div>
      )}
    </div>
  );
}