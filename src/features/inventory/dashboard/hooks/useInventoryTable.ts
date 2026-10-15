// src/features/inventory/dashboard/hooks/useInventoryTable.ts

import { useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { InventoryFilters } from "../../model/types/inventory.types";
import { getInventoryFilters } from "../constants/inventoryFilters";
import { useLang } from "@/shared/context/LanguageContext";
import { useInventoryStore } from "../../model/store/useInvntoryStore";
import { inventoryStatsStore } from "../../model/store/invntoryStatusHooks";

export function useInventoryTable() {
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
    trashedItems,
    fetchError,
    isFetching: isLoading,
    pagination,
    fetch,
    fetchTrashed,
  } = useInventoryStore();

  const inventoryStats = inventoryStatsStore(
    (state) => state.stats
  );

  useEffect(() => {
    const params: InventoryFilters = {
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

  const inventoryFilters: FilterField<InventoryFilters>[] = useMemo(
    () => getInventoryFilters(t, lang),
    [t, lang]
  );

  return {
    fetchError,
    showTrashed,
    setShowTrashed,
    isLoading,
    currentData: showTrashed ? trashedItems : items,
    status: inventoryStats,
    inventoryFilters,
    pagination,
    handleServerFilterOrPageChange,
    reload: () => {
      const params: InventoryFilters = {
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
    },
  };
}