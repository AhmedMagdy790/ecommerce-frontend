// src/shared/components/DataTable/DataTable.tsx
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Column, DataTableProps } from "./types";
import { useDataTable } from "./Hook/useDataTable";
import { Pagination } from "../Pagination/Pagination";
import FilterDataTable from "./FiltterDataTable";
import { useLanguage } from "@/hooks/useLanguage";

import { DataTableHeaderConfig } from "./DataTableHeaderConfig";
import { DataTableDesktop } from "./DataTableDesktop";
import { DataTableMobile } from "./DataTableMobile";

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  paginationMode,
  filterSideServer,
  meta,
  loading = false,
  renderMobileCard,
  showTrashed,
  onEdit,
  onDelete,
  onRestore,
  filterFields = [],
  searchableFields = ['name', 'title'],
  pageSize: propPageSize,
  pageSizeOptions,
}: DataTableProps<T, any> & { loading?: boolean }) {
  const { t } = useTranslation("common");
  const { dir } = useLanguage();

  const {
    activeCurrentPage,
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
    totalRecords,
  } = useDataTable({
    data,
    paginationMode,
    filterSideServer,
    meta,
    searchableFields,
    pageSize: propPageSize,
  });


  const hasActions = Boolean(onEdit || onDelete || onRestore);

  const renderCellContent = useCallback((col: Column<T>, item: T) => {
    let value = undefined;
    if (col.accessor) {
      value = typeof col.accessor === "function" ? col.accessor(item) : item[col.accessor];
    }
    if (col.render) {
      return col.render(value, item);
    }
    return value as React.ReactNode;
  }, []);

  return (
    <div className="space-y-4" dir={dir}>

      <FilterDataTable
        filterFields={filterFields}
        setFilters={setFilters}
        filters={filters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <DataTableHeaderConfig
        totalRecords={totalRecords}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={handlePageSizeChange}
      />

      <div className="relative bg-[var(--card-bg)] backdrop-blur-xl rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-x-auto shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all">
        {/* شاشة التحميل (Loader) */}
        {loading && (
          <div className="absolute inset-0 bg-[var(--card-bg)]/80 backdrop-blur-sm z-10 flex items-center justify-center p-12 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
              <span>{t("loading") || "Loading..."}</span>
            </div>
          </div>
        )}

        {!loading && currentData.length > 0 ? (
          <>
            <DataTableDesktop
              data={currentData}
              columns={columns}
              sortConfig={sortConfig}
              onSort={handleSort}
              renderCellContent={renderCellContent}
              hasActions={hasActions}
              showTrashed={showTrashed}
              onEdit={onEdit}
              onDelete={onDelete}
              onRestore={onRestore}
            />

            <DataTableMobile
              data={currentData}
              columns={columns}
              renderMobileCard={renderMobileCard}
              renderCellContent={renderCellContent}
              showTrashed={showTrashed}
              onEdit={onEdit}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          </>
        ) : !loading && currentData.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-text-muted)]">
            {t("no_results")}
          </div>
        ) : (
          <div className="h-48" />
        )}
      </div>

      {/* 4. الترقيم */}
      <Pagination
        currentPage={activeCurrentPage}
        lastPage={activeTotalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}