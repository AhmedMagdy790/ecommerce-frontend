import { useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { useLang } from "@/shared/context/LanguageContext";
import { useNavigationStore } from "../../model/store/navigationStore";
import type { NavMenuFilters } from "../../model/types/navigation.types";

export function useNavigationTable() {
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
    items,
    fetchError,
    isFetching: isLoading,
    pagination,
    fetch,
  } = useNavigationStore();

  useEffect(() => {
    const params: NavMenuFilters = {
      page,
      per_page: perPage,
      search,
      sort_by: sortBy,
      sort_direction: sortDirection,
      ...filters,
    };

    fetch(params);
  }, [
    page,
    perPage,
    search,
    sortBy,
    sortDirection,
    filters,
    fetch,
  ]);

  const lastFiltersRef = useRef(JSON.stringify(filters));

  const handleServerFilterOrPageChange = useCallback(
    (params: unknown) => {
      const queryParams = (params as Record<string, any>) || {};

      if (queryParams.page !== undefined && Number(queryParams.page) !== page) {
        setPage(Number(queryParams.page));
        return;
      }

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

  // إعداد حقول الفلترة للـ DataTable (مثل البحث أو الفلترة بالموقع location)
  const navigationFilters: FilterField<NavMenuFilters>[] = useMemo(
    () => [
      {
        key: "search",
        label: t("navigation.search", "Search Menus"),
        type: "text",
        placeholder: lang === "ar" ? "ابحث باسم القائمة..." : "Search by name...",
      },
      {
        key: "location",
        label: t("navigation.location", "Location"),
        type: "text",
        placeholder: lang === "ar" ? "فلترة حسب الموقع (مثل header)" : "Filter by location (e.g. header)",
      },
    ],
    [t, lang]
  );

  return {
    fetchError,
    isLoading,
    currentData: items,
    navigationFilters,
    pagination,
    handleServerFilterOrPageChange,
    reload: () => {
      const params: NavMenuFilters = {
        page,
        per_page: perPage,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
        ...filters,
      };
      fetch(params);
    },
  };
}