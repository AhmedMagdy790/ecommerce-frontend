// src/features/order/hooks/useOrderTable.ts

import { useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { getOrderFilters } from "../constants/orderFilters"; // دالة الفلاتر الخارجية للطلبات
import { useOrderStore } from "../../model/store/order.store";
import type { OrderFilters } from "../../model/types/order.types";
import { orderStatsStore } from "../../model/store/OrderStatusHooks";

export function useOrderTable() {
  const { t } = useTranslation("common");

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
  } = useOrderStore();

  const orderStats = orderStatsStore(
    (state) => state.stats
  );


  useEffect(() => {
    const params: OrderFilters = {
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

  // إعداد حقول الفلترة الخاصة بالطلبات (مثل حالة الطلب، حالة الدفع، المدن، إلخ)
  const orderFilters: FilterField<OrderFilters>[] = useMemo(
    () => getOrderFilters(t),
    [t]
  );

  return {
    fetchError,
    showTrashed,
    setShowTrashed,
    isLoading,
    currentData: showTrashed ? trashedItems : items,
    orderFilters,
    pagination,
    handleServerFilterOrPageChange,
    status: orderStats,
    reload: () => {
      const params: OrderFilters = {
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