// src/shared/components/Pagination/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { getVisiblePages } from "./pagination.utils";
import { PaginationButton } from "./PaginationButton";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationProps) {
  const { dir } = useLanguage();
  const isRTL = dir === "rtl";

  if (lastPage <= 1) return null;

  const pages = getVisiblePages(currentPage, lastPage);

  const prevIcon = isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />;
  const nextIcon = isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />;

  return (
    <nav aria-label="Pagination Navigation" className="flex items-center justify-between p-2">
      <div className="flex gap-2 items-center">
        {/* Previous Button */}
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={prevIcon}
          ariaLabel="Previous page"
        />

        {/* Page Numbers & Ellipsis */}
        <div className="flex gap-1 items-center">
          {pages.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-[var(--color-text-muted)]">
                  ...
                </span>
              );
            }

            const isCurrent = currentPage === page;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={`w-9 h-9 rounded-[var(--radius-md)] text-xs font-semibold transition-all ${
                  isCurrent
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
        <PaginationButton
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          icon={nextIcon}
          ariaLabel="Next page"
        />
      </div>
    </nav>
  );
}