// useCategoryTable.ts

import { useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type {
  CategoryFilters,
} from "../../model/types/category.types";
import { useCategoryStore } from "../../model/store/useCategoryStore";
import { getCategoryFilters } from "../constants/categoryFilters"; // استيراد دالة الفلاتر الخارجية
import { useLang } from "@/shared/context/LanguageContext"; // استيراد سياق اللغة
import { categoryStatsStore } from "../../model/store/categoryStatsHooks";

export function useCategoryTable() {
  const { t } = useTranslation("common");
  const { lang } = useLang();

  
  const {
    page,
    perPage,
    setPerPage,
    search,
    filters,
    sortBy,
    sortDirection,
    setSearch,
    setFilters,
    setPage,
    showTrashed,
    setShowTrashed,

    items,
    fetchError,
    trashedItems,
    isFetching: isLoading,
    pagination,
    fetch,
    fetchTrashed,
  } = useCategoryStore();

   const countryStats = categoryStatsStore(
      (state) => state.stats
    );

  const parentCategories = items.filter((item) => item?.parent?.id != null); 

  useEffect(() => {
    const params: CategoryFilters = {
      page,
      per_page: perPage,
      search,
      sort_by: sortBy,
      sort_direction: sortDirection,
      ...filters,
    };

    if (showTrashed) {
      fetchTrashed(params);
    } else {
      fetch(params);
    }
  }, [
    page,
    perPage,
    search,
    sortBy,
    sortDirection,
    filters,
    showTrashed,
    fetch,
    fetchTrashed,
  ]);

  const lastFiltersRef = useRef(JSON.stringify(filters));

  const handleServerFilterOrPageChange = useCallback(
    (params: unknown) => {
      const queryParams = (params as Record<string, any>) || {};

      if (queryParams.page !== undefined && Number(queryParams.page) !== page) {
        setPage(Number(queryParams.page));
        return;
      }

      // دعم تغير حجم الصفحة (per_page / pageSize) القادم من الـ DataTable الجديد
      if (queryParams.per_page !== undefined && Number(queryParams.per_page) !== perPage) {
        setPerPage(Number(queryParams.per_page));
        setPage(1);
        return;
      }

      if (queryParams.search !== undefined && queryParams.search !== search) {
        setSearch(queryParams.search);
        setPage(1);
        return;
      }

      const { search: _, page: __, per_page: ___, filters: explicitFilters, ...restFilters } = queryParams;
      const incomingFilters = explicitFilters ?? restFilters;
      const incomingFiltersString = JSON.stringify(incomingFilters);

      if (incomingFiltersString !== lastFiltersRef.current) {
        lastFiltersRef.current = incomingFiltersString;
        setFilters(incomingFilters);
        setPage(1);
      }
    },
    [page, perPage, search, setSearch, setPage, setPerPage, setFilters]
  );


  const categoryFilters: FilterField<CategoryFilters>[] = useMemo(
    () => getCategoryFilters(t, parentCategories, lang),
    [t, parentCategories, lang]
  );

  return {
    fetchError,
    showTrashed,
    setShowTrashed,
    isLoading,
    currentData: showTrashed ? trashedItems : items,
    status: countryStats,
    categoryFilters,
    parentCategories,
    pagination,
    handleServerFilterOrPageChange,
    reload: () => {
      const params: CategoryFilters = {
        page,
        per_page: perPage,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
        ...filters,
      };
      if (showTrashed) fetchTrashed(params);
      else fetch(params);
    },
  };
}