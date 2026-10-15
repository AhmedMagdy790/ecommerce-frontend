// src/shared/components/DataTable/DataTableMobile.tsx
import React from "react";
import { MobileActions } from "./MobileActions";
import type { Column } from "./types";

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  renderMobileCard?: (item: T) => React.ReactNode;
  renderCellContent: (col: Column<T>, item: T) => React.ReactNode;
  showTrashed?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
}

export function DataTableMobile<T extends { id: string | number }>({
  data,
  columns,
  renderMobileCard,
  renderCellContent,
  showTrashed,
  onEdit,
  onDelete,
  onRestore,
}: Props<T>) {
  // فصل أول عمودين لاستخدامهما كعنوان وكارت تعريفي متناسق
  const primaryColumn = columns[0];
  const secondaryColumn = columns[1];
  const remainingColumns = columns.slice(2);

  return (
    <div className="md:hidden space-y-3 p-3 bg-[var(--color-surface-secondary)]/30">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all space-y-3"
        >
          {/* Custom Card fallback if user provided renderMobileCard */}
          {renderMobileCard ? (
            renderMobileCard(item)
          ) : (
            <div className="space-y-3">
              {/* Card Header: Title & Main Status/Subtitle */}
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-[var(--color-border)]/60">
                <div className="space-y-0.5">
                  {primaryColumn && (
                    <span className="text-xs text-[var(--color-text-muted)] font-medium block uppercase tracking-wider">
                      {primaryColumn.header}
                    </span>
                  )}
                  <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {primaryColumn ? renderCellContent(primaryColumn, item) : `#${item.id}`}
                  </div>
                </div>

                {secondaryColumn && (
                  <div className="text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-secondary)] px-2.5 py-1 rounded-[var(--radius-md)] border border-[var(--color-border)] shrink-0">
                    {renderCellContent(secondaryColumn, item)}
                  </div>
                )}
              </div>

              {/* Card Body: Remaining Data Grid */}
              {remainingColumns.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {remainingColumns.map((col, idx) => (
                    <div key={col.id ? String(col.id) : idx} className="space-y-0.5">
                      <span className="text-[11px] font-medium text-[var(--color-text-muted)] block uppercase">
                        {col.header}
                      </span>
                      <div className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                        {renderCellContent(col, item)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Card Footer: Action Buttons */}
          <MobileActions
            item={item}
            showTrashed={showTrashed}
            onEdit={onEdit}
            onDelete={onDelete}
            onRestore={onRestore}
          />
        </div>
      ))}
    </div>
  );
}