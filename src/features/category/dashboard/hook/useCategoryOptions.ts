// src/features/category/dashboard/hooks/useCategoryOptions.ts

import { useEffect, useMemo } from "react";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { useCategoryStore } from "@/features/category/model/store/useCategoryStore";

interface UseCategoryOptionsConfig {
  enabled?: boolean;
}

export function useCategoryOptions(
  initialSearch = "",
  { enabled = true }: UseCategoryOptionsConfig = {}
) {
  const { lang } = useLang();

  const {
    items: categories,
    fetch: fetchCategories,
    isFetching,
  } = useCategoryStore();

  useEffect(() => {
    if (!enabled) return;

    fetchCategories({ search: initialSearch.trim() || undefined });
  }, [enabled, initialSearch, fetchCategories]);

  const categoryOptions = useMemo(() => {
    if (!enabled) return [];

    return (categories || []).map((category) => ({
      label: getLocalizedName(category.name, lang),
      value: category.id,
    }));
  }, [enabled, categories, lang]);

  return {
    categoryOptions,
    isCategoriesLoading: enabled && isFetching,
  };
}