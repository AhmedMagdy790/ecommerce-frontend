import type React from "react";
import type { FilterField } from "./FiltterDataTable";
import type { PaginationMeta } from "@/shared/types/api.types";

export type PaginationMode =
  | "client"
  | "server"
  | "limited";

export type Filters<T> =
  Partial<Record<keyof T | string, unknown>>;

export type ServerTableParams<
  F extends object = Record<string, unknown>
> = F & {
  search: string;
  page: number;
  per_page: number;
};

export interface Column<T> {
  id?: string | number;

  header: string;

  accessor?:
    | keyof T
    | ((item: T) => unknown);

  sortable?: boolean;

  sortKey?: keyof T;

  render?: <TValue = any>(
    value: TValue,
    item: T
  ) => React.ReactNode;

  className?: string;
}

export interface DataTableProps<
  T extends object,
  F extends object = Record<string, unknown>
> {
  data: T[];

  paginationMode?: PaginationMode;

  filterSideServer?: (
    params: ServerTableParams
  ) => void;

  columns: Column<T>[];

  showTrashed?: boolean;

  renderMobileCard?: (
    item: T
  ) => React.ReactNode;

  onEdit?: (item: T) => void;

  onDelete?: (item: T) => void;

  onRestore?: (item: T) => void;

  pageSize?: number;

  pageSizeOptions?: number[];

  filterFields?: FilterField<F>[];

  meta?: PaginationMeta;

  onPageChange?: (page: number) => void;

  searchableFields?: (keyof T | string)[];
}