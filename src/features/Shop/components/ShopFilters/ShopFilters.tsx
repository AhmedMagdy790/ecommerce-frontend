// src/pages/Shop/components/ShopFilters/ShopFilters.tsx

import { useState } from "react";
import { useLang } from "@/shared/context/LanguageContext";

import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ResetFilters from "./ResetFilters";

interface Category {
  id: string | number;
  name: string | { ar?: string; en?: string };
  slug: string;
}

interface ShopFiltersProps {
  data?: {
    categories?: Category[];
    price?: {
      min: number;
      max: number;
    };
  };

  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;

  priceRange?: {
    min: string;
    max: string;
  };

  onPriceChange?: (price: {
    min: string;
    max: string;
  }) => void;

  onReset?: () => void;
}

export default function ShopFilters({
  data,
  selectedCategories = [],
  onCategoryChange,
  priceRange = { min: "", max: "" },
  onPriceChange,
  onReset,
}: ShopFiltersProps) {
  const { isRTL } = useLang();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const categories = data?.categories ?? [];
  const defaultMinPrice = data?.price?.min ?? 0;
  const defaultMaxPrice = data?.price?.max ?? 1000;

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange.min || priceRange.max ? 1 : 0);

  const handleReset = () => {
    onReset?.();

    setIsCategoryOpen(false);
    setIsPriceOpen(false);
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="
        mb-[var(--spacing-8)]
        flex w-full flex-wrap items-center justify-between
        gap-[var(--spacing-4)]
        rounded-[var(--radius-3xl)]
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-[var(--spacing-4)]
        shadow-[var(--shadow-sm)]
        sm:p-[var(--spacing-6)]
      "
    >
      <div className="flex flex-wrap items-center gap-[var(--spacing-3)]">
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          isOpen={isCategoryOpen}
          onToggleOpen={() => {
            setIsCategoryOpen((prev) => !prev);
            setIsPriceOpen(false);
          }}
          onClose={() => setIsCategoryOpen(false)}
          onChange={onCategoryChange ?? (() => {})}
        />

        <PriceFilter
          isOpen={isPriceOpen}
          onToggleOpen={() => {
            setIsPriceOpen((prev) => !prev);
            setIsCategoryOpen(false);
          }}
          defaultMin={defaultMinPrice}
          defaultMax={defaultMaxPrice}
          value={priceRange}
          onChange={onPriceChange ?? (() => {})}
        />
      </div>

      <ResetFilters
        activeFiltersCount={activeFiltersCount}
        onReset={handleReset}
      />
    </div>
  );
}