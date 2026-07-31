import React from "react";
import type { Column, DataTableProps } from "./types";
import { useDataTable } from "./Hook/useDataTable";
import { TableActions } from "./TableActions";
import { TablePagination } from "./TablePagination";
import FilterDataTable from "./FiltterDataTable";
import { MobileActions } from "./MobileActions";

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  lang,
  paginationType,
  filterSideServer,
  meta,
  renderMobileCard,
  showTrashed,
  onEdit,
  onDelete,
  onRestore,
  pageSize = 10, // Recommended default increased to 10 for better dataset browsing
  filterFields = [],
}: DataTableProps<T>) {

  const {
    currentPage,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    totalPages,
    currentData,
    handlePageChange,
  } = useDataTable({
    data,
    paginationType,
    filterSideServer,
    meta,
    pageSize,
  });

  const isRtl = lang === "ar";
  const hasActions = Boolean(onEdit || onDelete || onRestore);

  const renderCellContent = (col: Column<T>, item: T) => {
    let value = undefined;
    if (col.accessor) {
      value = typeof col.accessor === "function" ? col.accessor(item) : item[col.accessor];
    }
    if (col.render) {
      return col.render(value, item);
    }
    return value as React.ReactNode;
  };

  return (
    <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
      <FilterDataTable
        filterFields={filterFields}
        setFilters={setFilters}
        filters={filters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        lang={lang}
      />

      <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-[var(--color-surface-secondary)] backdrop-blur border-b border-[var(--color-border)]">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`p-4 text-start text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)] ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
                {hasActions && (
                  <th className="p-4 text-center text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                    {isRtl ? "إجراءات" : "Actions"}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {Array.isArray(currentData) && currentData.length > 0 && currentData.map((item) => (
                <tr
                  key={`row-${item.id}`}
                  className="group relative hover:bg-[var(--color-surface-secondary)]/50 transition-colors"
                >
                  {columns.map((col, idx) => (
                    <td
                      key={`cell-${item.id}-${idx}`}
                      className={`p-4 text-sm text-[var(--color-text-primary)] ${col.className ?? ""}`}
                    >
                      {renderCellContent(col, item)}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="p-4 text-sm transition text-center">
                      <TableActions
                        item={item}
                        isRtl={isRtl}
                        showTrashed={showTrashed}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onRestore={onRestore}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[var(--color-border)]">
          {Array.isArray(currentData) && currentData.length > 0 && currentData.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              {renderMobileCard && renderMobileCard(item)}
              <MobileActions
                item={item}
                isRtl={isRtl}
                showTrashed={showTrashed}
                onEdit={onEdit}
                onDelete={onDelete}
                onRestore={onRestore}
              />
            </div>
          ))}
        </div>

        {(!Array.isArray(currentData) || currentData.length === 0) && (
          <div className="p-12 text-center text-sm text-[var(--color-text-muted)]">
            {isRtl ? "لا توجد نتائج" : "No results found"}
          </div>
        )}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        isRtl={isRtl}
        onPageChange={handlePageChange}
      />
    </div>
  );
}