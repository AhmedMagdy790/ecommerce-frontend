import type { PaginationMeta } from "../types/api.types";

export const DEFAULT_PAGINATION: PaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  type: "server",
};