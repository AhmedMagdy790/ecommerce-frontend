export interface IPagination {
  type: "server" | "client" | "limited";
  current_page: number;
  last_page: number;
  total: number;
  per_page?: number;
  has_more: boolean;
}

export interface PaginationFilters {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc" | string;
  [key: string]: unknown;
}

export interface ResponseDataPaginat<T> {
    data: T[];
    pagination?: IPagination;
}