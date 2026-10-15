// src/shared/components/DataTable/DataTableHeaderConfig.tsx
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  totalRecords?: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageSizeChange: (size: number) => void;
}

export const DataTableHeaderConfig: React.FC<Props> = ({
  totalRecords,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onPageSizeChange,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-[var(--color-text-secondary)]">
      <div>
        {t("total_items", "Total Records")}:{" "}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {totalRecords ?? 0}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span>{t("show", "Show")}:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] font-medium outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all cursor-pointer"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>{t("per_page", "per page")}</span>
      </div>
    </div>
  );
};