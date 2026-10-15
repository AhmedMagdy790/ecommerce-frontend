// src/shared/components/DataTable/DataTableDesktop.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Column } from "./types";
import type { SortConfig } from "./Hook/useDataTable";
import { TableActions } from "./TableActions";

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  sortConfig: SortConfig<T>;
  onSort: (key: keyof T) => void;
  renderCellContent: (col: Column<T>, item: T) => React.ReactNode;
  hasActions: boolean;
  showTrashed?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
}

export function DataTableDesktop<T extends { id: string | number }>({
  data,
  columns,
  sortConfig,
  onSort,
  renderCellContent,
  hasActions,
  showTrashed,
  onEdit,
  onDelete,
  onRestore,
}: Props<T>) {
  const { t } = useTranslation("common");

  return (
    <div className="hidden md:block">
      <table className="w-full text-start border-collapse">
        <thead className="bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)]">
          <tr>
            {columns.map((col, index) => {
              const sortKey = (col.sortKey || (typeof col.accessor === "string" ? col.accessor : col.id || `col-${index}`)) as keyof T;
              const isSorted = sortConfig.key === sortKey;
              const isSortable = col.sortable !== false;

              return (
                <th
                  key={String(col.id || col.accessor || index)}
                  onClick={() => isSortable && onSort(sortKey)}
                  className={`
                    p-4 text-start text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)] transition-colors
                    ${isSortable ? "cursor-pointer select-none hover:text-[var(--color-text-primary)]" : ""}
                    ${col.className ?? ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.header}</span>
                    {isSortable && (
                      <span className="shrink-0 text-[var(--color-text-muted)]">
                        {!isSorted && <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />}
                        {isSorted && sortConfig.order === "asc" && (
                          <ArrowUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        )}
                        {isSorted && sortConfig.order === "desc" && (
                          <ArrowDown className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
            {hasActions && (
              <th className="p-4 text-center text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">
                {t("actions", "Actions")}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {data.map((item) => (
            <tr
              key={`row-${item.id}`}
              className="group relative hover:bg-[var(--color-surface-secondary)]/50 transition-colors"
            >
              {columns.map((col, idx) => {
                const cellKey = col.id ? String(col.id) : (typeof col.accessor === "string" ? col.accessor : `cell-${idx}`);
                return (
                  <td
                    key={`cell-${item.id}-${cellKey}`}
                    className={`p-4 text-sm text-[var(--color-text-primary)] ${col.className ?? ""}`}
                  >
                    {renderCellContent(col, item)}
                  </td>
                );
              })}

              {hasActions && (
                <td className="p-4 text-sm transition text-center">
                  <TableActions
                    item={item}
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
  );
}