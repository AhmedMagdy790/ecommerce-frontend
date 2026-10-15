// src/shared/components/Pagination/pagination.utils.ts

export type PaginationItem = number | "ellipsis";

export function getVisiblePages(current: number, lastPage: number): PaginationItem[] {
  const pages: PaginationItem[] = [];

  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }

  pages.push(1);

  if (current > 3) {
    pages.push("ellipsis");
  }

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(lastPage - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }

  if (current < lastPage - 2) {
    pages.push("ellipsis");
  }

  pages.push(lastPage);

  return pages;
}