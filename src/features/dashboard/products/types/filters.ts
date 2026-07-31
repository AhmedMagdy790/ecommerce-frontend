import type { Status } from "./api";

export interface ProductFilters {
  search?: string;

  category?: number;

  brand?: number;

  status?: Status;

  page?: number;
}