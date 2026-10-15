import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";
import type { TranslatedText } from "@/shared/types/types";

export type InventoryStats = {
  total: number;
  in_stock: number;      // متوفر
  low_stock: number;     // منخفض
  out_of_stock: number;  // نافد
};

export interface Inventory {
  id: number;
  product_variant_id: number;
  stock_quantity: number;
  reserved_quantity: number;
  available_stock?: number;
  available_quantity?: number;
  product_variant?: ProductVariant & {
    product_name?: TranslatedText;
  };
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface InventoryFormData {
  product_variant_id: number | string;
  stock_quantity: number;
  reserved_quantity?: number | null;
}

export interface InventoryFilters {
  search?: string;
  low_stock?: boolean;
  product_id?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;

  [key: string]: unknown;
}