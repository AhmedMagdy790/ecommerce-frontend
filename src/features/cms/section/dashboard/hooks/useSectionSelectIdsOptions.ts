// src/features/cms/section/dashboard/hooks/useSectionContentOptions.ts

import { useMemo, useState } from "react";
import { SectionTypes, type SectionType } from "../../model/types/section.types";
import { useProductOptions } from "@/features/product/dashboard/hook/useProductOptions";
import { useCategoryOptions } from "@/features/category/dashboard/hook/useCategoryOptions";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function useSectionContentOptions(type: SectionType) {
  const [searchState, setSearchState] = useState({ type, value: "" });
  const search = searchState.type === type ? searchState.value : "";
  const debouncedSearch = useDebounce(search, 400);

  // تفعيل المصدر المناسب للـ type فقط
  const isProducts = type === SectionTypes.PRODUCTS;
  const isCategory = type === SectionTypes.CATEGORY;

  const { productOptions, isProductsLoading } = useProductOptions(
    debouncedSearch,
    { enabled: isProducts }
  );
  const { categoryOptions, isCategoriesLoading } = useCategoryOptions(
    debouncedSearch,
    { enabled: isCategory }
  );

  // Keep search isolated by type without synchronously updating state in an effect.
  const setSearch = (value: string) => setSearchState({ type, value });

  // نحسب الاثنين في memo واحد بدل اثنين
  const { contentOptions, isContentLoading } = useMemo(() => {
    switch (type) {
      case SectionTypes.PRODUCTS:
        return { contentOptions: productOptions, isContentLoading: isProductsLoading };
      case SectionTypes.CATEGORY:
        return { contentOptions: categoryOptions, isContentLoading: isCategoriesLoading };
      default:
        return { contentOptions: [], isContentLoading: false };
    }
  }, [type, productOptions, categoryOptions, isProductsLoading, isCategoriesLoading]);

  return {
    contentOptions,
    isContentLoading,
    // هل هذا النوع يحتاج اختيار عناصر أصلاً؟ مفيد لإخفاء الـ Select في الـ UI
    hasContentPicker: isProducts || isCategory,
    search,
    setSearch,
  };
}