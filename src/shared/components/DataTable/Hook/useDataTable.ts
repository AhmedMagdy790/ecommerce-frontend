import { useState, useMemo, useEffect, useCallback } from "react";
import type { DataTableProps } from "../types";
import { filterItems } from "../helpers/filterItems";

export type SortOrder = "asc" | "desc" | null;

export interface SortConfig<T> {
  key: keyof T | null;
  order: SortOrder;
}

function compareValues(
  aValue: unknown,
  bValue: unknown,
  order: SortOrder
): number {
  if (aValue == null) return 1;
  if (bValue == null) return -1;

  if (typeof aValue === "string" && typeof bValue === "string") {
    return order === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  }

  if (aValue instanceof Date && bValue instanceof Date) {
    return order === "asc"
      ? aValue.getTime() - bValue.getTime()
      : bValue.getTime() - aValue.getTime();
  }

  if (aValue < bValue) return order === "asc" ? -1 : 1;
  if (aValue > bValue) return order === "asc" ? 1 : -1;

  return 0;
}

export function useDataTable<
  T extends { id: string | number },
  F extends object = Record<string, unknown>
>({
  data = [],
  paginationMode = "client",
  filterSideServer,
  meta,
  searchableFields,
  pageSize: initialPageSize = 10,
}: Pick<
  DataTableProps<T, F>,
  | "data"
  | "paginationMode"
  | "filterSideServer"
  | "meta"
  | "pageSize"
> & {
  searchableFields?: (keyof T | string)[];
}) {

  // ==================== States ====================

  const [clientPage, setClientPage] = useState(1);

  const [filters, setFilters] = useState<Partial<F>>({});

  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    order: null,
  });

  const [pageSize, setPageSize] = useState(initialPageSize);

  // ==================== Derived Values ====================

  const currentPage =
    paginationMode === "server"
      ? meta?.current_page ?? 1
      : clientPage;


  


  // ==================== Server Request ====================

  const sendServerRequest = useCallback(
    (pageToFetch: number, customPageSize?: number) => {


      filterSideServer?.({
        ...filters,
        search: debouncedSearch,
        page: pageToFetch,
        per_page: customPageSize ?? pageSize,
      } as F & {
        search: string;
        page: number;
        per_page: number;
      });
    },
    [
      filterSideServer,
      filters,
      debouncedSearch,
      pageSize,
    ]
  );

  // ==================== Sorting ====================

  const handleSort = useCallback((key: keyof T) => {
    setSortConfig((prev) => {
      const next =
        prev.key !== key
          ? "asc"
          : prev.order === "asc"
            ? "desc"
            : null;

      return {
        key: next ? key : null,
        order: next,
      };
    });
  }, []);

  // ==================== Search Debounce ====================

  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ==================== Server Pagination ====================

  useEffect(() => {
    if (paginationMode !== "server") {
      return;
    }

    sendServerRequest(1);
  }, [
    paginationMode,
    filters,
    debouncedSearch,
    pageSize,
  ]);

  // ==================== Client Filtering ====================

  const filteredData = useMemo(() => {
    if (paginationMode === "server") {
      return data;
    }


    return filterItems(
      data,
      debouncedSearch,
      filters,
      searchableFields
    );
  }, [
    data,
    debouncedSearch,
    filters,
    paginationMode,
    searchableFields,
  ]);

  // ==================== Sorting ====================

  const sortedData = useMemo(() => {
    if (
      paginationMode === "server" ||
      !sortConfig.key ||
      !sortConfig.order
    ) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) =>
      compareValues(
        a[sortConfig.key!],
        b[sortConfig.key!],
        sortConfig.order
      )
    );
  }, [
    filteredData,
    sortConfig,
    paginationMode,
  ]);

  // ==================== Pagination ====================

  const totalPages = useMemo(() => {
    if (paginationMode === "server") {
      return meta?.last_page ?? 1;
    }

    return Math.ceil(
      sortedData.length / pageSize
    ) || 1;
  }, [
    paginationMode,
    meta?.last_page,
    sortedData.length,
    pageSize,
  ]);

  const activeCurrentPage =
    paginationMode === "server"
      ? meta?.current_page ?? 1
      : clientPage;

  const activeTotalPages =
    paginationMode === "server"
      ? meta?.last_page ?? 1
      : totalPages;

  // ==================== Current Data ====================

  const currentData = useMemo(() => {
    if (paginationMode === "server") {
      return sortedData;
    }

    const start =
      (clientPage - 1) * pageSize;

    const end =
      clientPage * pageSize;

    return sortedData.slice(start, end);
  }, [
    paginationMode,
    sortedData,
    clientPage,
    pageSize,
  ]);

  // ==================== Page Change ====================

  const handlePageChange = useCallback(
    (page: number) => {
      if (
        page < 1 ||
        page > activeTotalPages
      ) {
        return;
      }


      if (paginationMode === "server") {
        sendServerRequest(page);
        return;
      }

      setClientPage(page);
    },
    [
      activeTotalPages,
      paginationMode,
      sendServerRequest,
    ]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);

      if (paginationMode === "server") {
        sendServerRequest(1, size);
      }
    },
    [paginationMode, sendServerRequest]
  );

  // ==================== Return ====================

  return {
    currentPage,
    activeCurrentPage,
    totalPages,
    activeTotalPages,

    filters,
    setFilters,

    searchTerm,
    setSearchTerm,

    currentData,
    handlePageChange,
    handlePageSizeChange,

    sortConfig,
    handleSort,

    pageSize,
    setPageSize,

    totalRecords:
      paginationMode === "server"
        ? meta?.total
        : sortedData.length,
  };
}