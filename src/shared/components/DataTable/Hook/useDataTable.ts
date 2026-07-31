import { useState, useMemo, useEffect, useRef } from "react";
import type { DataTableProps, Filters } from "../types";

export function useDataTable<T extends { id: string | number }>({
  data = [],
  paginationType,
  filterSideServer,
  meta,
  pageSize = 5,
}: Pick<
  DataTableProps<T>,
  "data" | "paginationType" | "filterSideServer" | "meta" | "pageSize"
>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters<T>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isFirstRender = useRef(true);

  const serverFilterRef = useRef(filterSideServer);
  serverFilterRef.current = filterSideServer;

  useEffect(() => {
    if (paginationType === "server" && meta?.current_page) {
      setCurrentPage(meta.current_page);
    }
  }, [paginationType, meta?.current_page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page to 1 on client-side when search or filters change
  useEffect(() => {
    if (paginationType === "client") {
      setCurrentPage(1);
    }
  }, [filters, debouncedSearch, paginationType]);

  useEffect(() => {
    if (paginationType !== "server") return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    serverFilterRef.current?.({
      ...filters,
      search: debouncedSearch,
      page: 1,
    });
  }, [filters, debouncedSearch, paginationType]);


  const displayData = useMemo(() => {
    if (paginationType === "server") {
      return data;
    }

    return data.filter((item) => {
      // 1. Search Logic: If debouncedSearch is empty, it should instantly match all items.
      const matchesSearch = !debouncedSearch || Object.values(item).some((value) => {
        if (value == null) return false;

        if (typeof value === "object") {
          return Object.values(value).some((v) =>
            v != null && String(v).toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }

        return String(value)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      });

      // 2. Filters Logic: Checks specific field filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (value === "" || value == null) return true;

        const itemValue = item[key as keyof T];

        if (typeof itemValue === "string") {
          return itemValue
            .toLowerCase()
            .includes(String(value).toLowerCase());
        }

        if (itemValue && typeof itemValue === "object") {
          return Object.values(itemValue).some((v) =>
            v != null && String(v).toLowerCase().includes(String(value).toLowerCase())
          );
        }

        return itemValue == value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, filters, debouncedSearch, paginationType]);


  const totalPages =
    paginationType === "server"
      ? meta?.last_page ?? 1
      : Math.ceil(displayData.length / pageSize) || 1;

  const currentData =
    paginationType === "server"
      ? displayData
      : displayData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    if (paginationType === "server") {
      serverFilterRef.current?.({
        ...filters,
        search: debouncedSearch,
        page,
      });

      return;
    }

    setCurrentPage(page);
  };

  return {
    currentPage,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    totalPages,
    currentData,
    handlePageChange,
  };
}