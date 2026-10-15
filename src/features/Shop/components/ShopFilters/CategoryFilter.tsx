// src/pages/Shop/components/CategoryFilter.tsx

import { useState, useMemo } from "react";
import { ChevronDown, SlidersHorizontal, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface Category {
  id: string | number;
  name: string | { ar?: string; en?: string };
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onClose: () => void;
  onChange: (categories: string[]) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  isOpen,
  onToggleOpen,
  onChange,
}: CategoryFilterProps) {
  const { t } = useTranslation("shop");
  const { lang } = useLang();

  // Local state for live searching within categories dropdown
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryName = (
    name: string | { ar?: string; en?: string }
  ) => {
    if (typeof name === "string") return name;
    return name?.[lang as keyof typeof name] ?? name?.en ?? name?.ar ?? "";
  };

  const handleToggle = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onChange(selectedCategories.filter((item) => item !== slug));
    } else {
      onChange([...selectedCategories, slug]);
    }
  };

  // Filter categories based on search input query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((cat) => {
      const nameStr = getCategoryName(cat.name).toLowerCase();
      return nameStr.includes(searchQuery.toLowerCase());
    });
  }, [categories, searchQuery, lang]);

  if (!categories.length) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggleOpen}
        className="inline-flex items-center gap-[var(--spacing-2)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-background)] px-[var(--spacing-4)] py-[var(--spacing-2.5)] text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-primary)] transition-all hover:border-[var(--color-primary)] cursor-pointer"
      >
        <SlidersHorizontal
          size={16}
          className="text-[var(--color-primary)]"
        />

        <span>
          {t("filters.categories", {
            defaultValue: lang === "ar"
              ? "التصنيفات"
              : "Categories",
          })}
        </span>

        {selectedCategories.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-white">
            {selectedCategories.length}
          </span>
        )}

        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute start-0 top-full z-50 mt-2 w-72 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--spacing-3)] shadow-xl space-y-[var(--spacing-3)]">
          
          {/* Search Input Box */}
          <div className="relative">
            <Search size={14} className="absolute inset-y-0 my-auto start-3 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "ar" ? "ابحث في التصنيفات..." : "Search categories..."}
              className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-background)] px-[var(--spacing-3)] py-[var(--spacing-2)] ps-8 pe-8 text-[var(--text-xs)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 my-auto end-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Categories List Options */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const checked = selectedCategories.includes(category.slug);

                return (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-[var(--spacing-3)] rounded-[var(--radius-xl)] p-[var(--spacing-2)] transition-colors hover:bg-[var(--color-surface-secondary)]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggle(category.slug)}
                      className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] cursor-pointer"
                    />

                    <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                      {getCategoryName(category.name)}
                    </span>
                  </label>
                );
              })
            ) : (
              <div className="py-6 text-center text-[var(--text-xs)] text-[var(--color-text-muted)]">
                {lang === "ar" ? "لا توجد نتائج مطابقة" : "No matching categories"}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}