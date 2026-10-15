// src/features/users/dashboard/hook/useUserTable.ts
import { useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { UserFilters } from "../../model/types/user.types";
import { useUserStore } from "../../model/store/useUserStore";
// import { useUserTableStore } from "../../model/store/useUserTableStore";
import { getUserFilters } from "../constants/userFilters";

export function useUserTable() {
  const { t } = useTranslation("common");

  
  // Zustand Feature Store State & Actions
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
  } = useUserStore();

  useEffect(() => {
    const params: UserFilters = {
      page,
      per_page: perPage,
      search,
      sort_by: sortBy,
      sort_direction: sortDirection,
      ...filters,
    };

    if (showTrashed && fetchTrashed) {
      void fetchTrashed(params);
    } else {
      void fetch(params);
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

  const userFiltersFields: FilterField<UserFilters>[] = useMemo(
    () => (typeof getUserFilters === "function" ? getUserFilters(t) : []),
    [t]
  );

  return {
    fetchError,
    showTrashed,
    setShowTrashed,
    isLoading,
    currentData: showTrashed ? trashedItems : items,
    userFilters: userFiltersFields,
    pagination,
    handleServerFilterOrPageChange,
    reload: () => {
      const params: UserFilters = {
        page,
        per_page: perPage,
        search,
        sort_by: sortBy,
        sort_direction: sortDirection,
        ...filters,
      };
      if (showTrashed && fetchTrashed) void fetchTrashed(params);
      else void fetch(params);
    },
  };
}