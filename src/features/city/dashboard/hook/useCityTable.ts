// src/features/cities/hook/useCityTable.ts

import { useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { useLang } from "@/shared/context/LanguageContext";
import { useCityStore } from "../../model/store/city.store";
import type { CityFilters } from "../../model/types/city.types";
import { getCityFilters } from "../constants/getCityFilters";
import { useCountryStore } from "@/features/country/model/store/useCountryStore";
import { cityStatsStore } from "../../model/store/CityStatusHooks";

export function useCityTable() {
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
    isFetching: isLoading,
    pagination,
    fetch,
  } = useCityStore();

   const countryStats = cityStatsStore(
      (state) => state.stats
    );

  const {
    fetch: fetchCountry,
    items: itemsCountry
  } = useCountryStore();

  useEffect(() => {
    const params: CityFilters = {
      page,
      per_page: perPage,
      search,
      sort_by: sortBy,
      sort_direction: sortDirection,
      ...filters,
    };

    fetchCountry();
    fetch(params);
  }, [
    page,
    perPage,
    search,
    sortBy,
    sortDirection,
    filters,
    fetch,
    fetchCountry
  ]);

  const lastFiltersRef = useRef(JSON.stringify(filters));
  const pageRef = useRef(page);
  const perPageRef = useRef(perPage);
  const searchRef = useRef(search);
  const filtersRef = useRef(filters);

  useEffect(() => {
    pageRef.current = page;
    perPageRef.current = perPage;
    searchRef.current = search;
    filtersRef.current = filters;
  }, [page, perPage, search, filters]);

  const handleServerFilterOrPageChange = useCallback(
    (params: unknown) => {
      const queryParams = (params as Record<string, any>) || {};
      const currentPage = pageRef.current;
      const currentPerPage = perPageRef.current;
      const currentSearch = searchRef.current;
      const currentFilters = filtersRef.current;

      if (queryParams.page !== undefined && Number(queryParams.page) !== currentPage) {
        setPage(Number(queryParams.page));
        return;
      }

      if (queryParams.per_page !== undefined && Number(queryParams.per_page) !== currentPerPage) {
        setPerPage(Number(queryParams.per_page));
        setPage(1);
        return;
      }

      if (queryParams.search !== undefined && queryParams.search !== currentSearch) {
        setSearch(queryParams.search);
        setPage(1);
        return;
      }

      const { search: _, page: __, per_page: ___, filters: explicitFilters, ...restFilters } = queryParams;
      const incomingFilters = explicitFilters ?? restFilters;
      const incomingFiltersString = JSON.stringify(incomingFilters);
      const currentFiltersString = JSON.stringify(currentFilters);

      if (incomingFiltersString !== currentFiltersString && incomingFiltersString !== lastFiltersRef.current) {
        lastFiltersRef.current = incomingFiltersString;
        setFilters(incomingFilters);
        setPage(1);
      }
    },
    [setSearch, setPage, setPerPage, setFilters]
  );

  const cityFilters: FilterField<CityFilters>[] = useMemo(
    () => getCityFilters(t, itemsCountry, lang),
    [t, itemsCountry, lang]
  );

  return {
    fetchError,
    showTrashed,
    setShowTrashed,
    isLoading,
    currentData: items,
    cityFilters,
    pagination,
    stats: countryStats,
    handleServerFilterOrPageChange,
    reload: () => {
      const params: CityFilters = {
        page,
        per_per: perPage, // ملاحظة: تأكد إن كانت per_per أو per_page بحسب الـ interface لديك
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