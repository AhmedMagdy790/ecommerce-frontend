import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  isRtl: boolean;
  onPageChange: (page: number) => void;
}

function getVisiblePages(current: number, total: number) {
  const pages: (number | "...")[] = [];

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export function TablePagination({
  currentPage,
  totalPages,
  isRtl,
  onPageChange,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex gap-2 items-center">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 border border-[var(--color-border)] bg-[var(--color-background)] rounded-[var(--radius-md)] text-[var(--color-text-secondary)] disabled:opacity-50 transition-colors hover:bg-[var(--color-surface-secondary)]"
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Page Numbers & Ellipsis */}
        <div className="flex gap-1 items-center">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-[var(--color-text-muted)]">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 rounded-[var(--radius-md)] text-xs font-semibold transition-all ${
                  currentPage === page
                    ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-xs)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] border border-transparent hover:border-[var(--color-border)]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 border border-[var(--color-border)] bg-[var(--color-background)] rounded-[var(--radius-md)] text-[var(--color-text-secondary)] disabled:opacity-50 transition-colors hover:bg-[var(--color-surface-secondary)]"
        >
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}