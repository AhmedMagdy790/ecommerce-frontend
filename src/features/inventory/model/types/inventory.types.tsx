
import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";
import type { TranslatedText } from "@/shared/types/types";

export interface InventoryStats {
  total: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}

export interface Inventory {
  id: number;
  product_variant_id: number;
  stock_quantity: number;
  reserved_quantity: number;
  available_stock: number;

  product_variant?: (ProductVariant & {
    product_name?: TranslatedText;
  }) | null;

  created_at?: string | null;
  updated_at?: string | null;
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
  product_id?: string | number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  page?: number;
  per_page?: number;
   [key: string]: unknown;
}