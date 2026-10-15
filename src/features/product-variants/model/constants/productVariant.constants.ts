import type { ProductVariantFilters } from "../types/productVariant.types";

/**
 * Default filters used for initial state and table resets
 */
export const DEFAULT_PRODUCT_VARIANT_FILTERS: ProductVariantFilters = {
  search: "",
  status: "active",
  product_status: "",
  product_id: "",
  page: 1,
  per_page: 10,
  sort_by: "id",
  sort_direction: "desc",
};

/**
 * Variant status options for select dropdowns & filter fields
 */
export const PRODUCT_VARIANT_STATUS_OPTIONS = [
  { label: "status.all", value: "" },
  { label: "status.active", value: "active" },
  { label: "status.inactive", value: "inactive" },
  { label: "status.archived", value: "archived" },
] as const;

/**
 * Sorting options for data table header sorting
 */
export const PRODUCT_VARIANT_SORT_KEYS = {
  ID: "id",
  SKU: "sku",
  PRICE: "price",
  STATUS: "status",
  CREATED_AT: "created_at",
} as const;