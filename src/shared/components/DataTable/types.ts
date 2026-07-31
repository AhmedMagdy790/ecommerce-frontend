// import { FilterField } from "../components/FiltterDataTable"; // استيراد مسار الفلاتر لديك

import type { FilterField } from "./FiltterDataTable";

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => any);
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

export type Filters<T> = Partial<Record<keyof T, string | number | boolean>>;

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  lang: "ar" | "en";
  searchPlaceholder?: string;
  paginationType: "client" | "server";
  filterSideServer?: (filters: Filters<T>) => void;
  showTrashed?: boolean;
  renderMobileCard?: (item: T) => React.ReactNode;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
  pageSize?: number;
  filterFields?: FilterField[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
}