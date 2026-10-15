// src/features/product/constants/product.constants.ts

import type { ProductFilters } from "../types/product.types";

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  search: "",
  status: undefined,
  sort_by: "created_at",
  sort_direction: "desc",
  page: 1,
  per_page: 10,
};