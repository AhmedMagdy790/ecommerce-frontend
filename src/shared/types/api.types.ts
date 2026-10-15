// src/shared/types/api.types.ts

export interface SuccessApiResponse<T> {
  status: "success";
  message: string;
  data: T;
}

export interface ErrorApiResponse {
  status: "error";
  message: string;
  data: null;
}

export interface ValidationErrorApiResponse<
  T = Record<string, string[]>
> {
  status: "error";
  message: string;
  errors: T;
}

export interface PaginationMeta {
  type: "client" | "server" | "limited";
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more?: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export type PaginatedApiResponse<T> =
  SuccessApiResponse<PaginatedData<T>>;

export type ApiResponse<T> =
  | SuccessApiResponse<T>
  | ErrorApiResponse;