import type { ApiAdminProduct } from "./api";

export interface ProductListResponse {
  list: ApiAdminProduct[];

  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}