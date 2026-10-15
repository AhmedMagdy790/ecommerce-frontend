// src/features/category/constants/category.constants.ts
import type { CategoryFilters } from "../model/types/category.types";


export const DEFAULT_CATEGORY_FILTERS: Omit<CategoryFilters, "page" | "per_page" | "sort_by" | "sort_direction" | "search"> = {
  status: "",
  parent_id: null,
};