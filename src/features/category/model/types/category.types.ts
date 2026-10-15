// src/feature/category/model/types/category.types.ts
import type { PaginationFilters } from "@/shared/types/pagination";
import type { TranslatedText } from "@/shared/types/types";


// تغيير الاسم هنا ليكون بعيداً عن التشابه
export interface CategorySummary {
  total: number;
  active: number;
  inactive: number;
}

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
}

export const CATEGORY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type CategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  trashed: number;
}


// Models / Entities
export interface Category<TText = TranslatedText | string>  {
  id: number;
  name: TText;
  slug: string;
  description: TText | null;
  parent_id: number | null;
  parent: Category<TText> | null;
  image?: string | null;
  status: CategoryStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  
  parent_category?: Category | null;
  children?: Category[];
  sections?: Array<{ id: number; name: string; sort_order: number }>;
  media?: Array<{ id: number; url: string; name: string }>;
}

export interface CategoryFilters extends PaginationFilters {
  name?: string;
  description?: string;
  search?: string;
  status?: CategoryStatus | '';
  parent_id?: number | null;
}
