import type { Product } from "@/features/product/model/types/product.types";
import type { TranslatedText } from "@/shared/types/types";

export interface Brand<TText = TranslatedText | string> {
  id: number;
  name: TText;
  slug: string;
  website: string | null;
  logo: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  products?: Product;
  sections?: Array<{ id: number; name: string; sort_order: number }>;
}

export interface BrandFormData {
  name: string;
  website?: string | null;
  is_active?: boolean;
  logo?: File | null;
}

export interface BrandFilters {
  search?: string;
  is_active?: boolean | '';
  [key: string]: any;
}