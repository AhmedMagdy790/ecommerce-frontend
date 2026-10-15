// src/features/managers/hooks/useManagerTable.ts

import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { useLang } from "@/shared/context/LanguageContext";


import type { ManagerFilters } from "../../model/types/manager.types";
import { getManagerFilters } from "../constants/managerFilters";
import { useManagerStore } from "../../model/store/useManagerStore";
import { ManagerStatsStore } from "../../model/store/mangerStatsHooks";

export function useManagerTable() {
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
  } = useManagerStore();

  const managerStats = ManagerStatsStore((state) => state.stats);

  const queryParams = useMemo<ManagerFilters>(
    () => ({
      page,
      per_page: perPage,
      search,
      sort_by: sortBy,
      sort_direction: sortDirection,
      ...filters,
    }),
    [
      page,
      perPage,
      search,
      sortBy,
      sortDirection,
      filters,
    ]
  );

  useEffect(() => {
    fetch(queryParams);
  }, [fetch, queryParams]);

  const handleServerFilterOrPageChange = useCallback(
    (params: unknown) => {
      if (!params || typeof params !== "object") {
        return;
      }

      const queryParams = params as Record<string, unknown>;

      if (queryParams.page !== undefined) {
        const nextPage = Number(queryParams.page);

        if (!Number.isNaN(nextPage) && nextPage !== page) {
          setPage(nextPage);
          return;
        }
      }

      if (queryParams.per_page !== undefined) {
        const nextPerPage = Number(queryParams.per_page);

        if (!Number.isNaN(nextPerPage) && nextPerPage !== perPage) {
          setPerPage(nextPerPage);
          setPage(1);
          return;
        }
      }

      if (
        queryParams.search !== undefined &&
        typeof queryParams.search === "string" &&
        queryParams.search !== search
      ) {
        setSearch(queryParams.search);
        setPage(1);
        return;
      }

      const {
        search: _search,
        page: _page,
        per_page: _perPage,
        filters: explicitFilters,
        ...restFilters
      } = queryParams;

      const incomingFilters =
        explicitFilters &&
        typeof explicitFilters === "object" &&
        !Array.isArray(explicitFilters)
          ? explicitFilters
          : restFilters;

      setFilters(incomingFilters as ManagerFilters);
      setPage(1);
    },
    [
      page,
      perPage,
      search,
      setSearch,
      setPage,
      setPerPage,
      setFilters,
    ]
  );

  const managerFilters = useMemo<FilterField<ManagerFilters>[]>(
    () => getManagerFilters(t, lang),
    [t, lang]
  );

  const reload = useCallback(() => {
    fetch(queryParams);
  }, [fetch, queryParams]);

  return {
    fetchError,
    isLoading,
    currentData: items,
    status: managerStats,
    managerFilters,
    pagination,
    handleServerFilterOrPageChange,
    reload,
  };
}