import type { PageFilters } from "../model/types/page.types";

export const DEFAULT_PAGE_FILTERS: Omit<
  PageFilters,
  "page" | "per_page" | "sort_by" | "sort_direction" | "search"
> = {
  is_active: "",
};