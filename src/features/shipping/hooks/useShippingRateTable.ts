// src/features/shipping/hooks/useShippingRateTable.ts

import { useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { useShippingRateStore } from "../model/store/shippingRate.store";
import type { ShippingRateFilters } from "../model/types/rate.types";
import { getShippingRateFilters } from "../dashboard/constants/shippingRateFilters";


export function useShippingRateTable() {
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
    items,
    fetchError,
    isFetching: isLoading,
    pagination,
    fetch,
  } = useShippingRateStore();

  useEffect(() => {
    const params: ShippingRateFilters = {
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

  // الفلاتر الخاصة بأسعار الشحن (مثل فلتر المدينة أو شركة الشحن أو الحالة)
  const shippingRateFilters: FilterField<ShippingRateFilters>[] = useMemo(
    () => getShippingRateFilters(t),
    [t]
  );

  return {
    fetchError,
    isLoading,
    currentData: items,
    shippingRateFilters,
    pagination,
    handleServerFilterOrPageChange,
    reload: () => {
      const params: ShippingRateFilters = {
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