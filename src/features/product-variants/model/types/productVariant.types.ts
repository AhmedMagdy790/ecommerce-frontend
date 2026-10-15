import type { TranslatedText } from "@/shared/types/types";
import type { Inventory } from "@/features/inventory/model/types/inventory.types";
import type { Product, ProductStatus } from "@/features/product/model/types/product.types";
import type { PaginationFilters } from "@/shared/types/pagination";

export type ProductVariantStatus = "active" | "inactive" | "archived";

export interface ProductVariant<TText = TranslatedText | string> {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  status: ProductVariantStatus;
  attributes?: Record<string, any> | null;
  weight?: number | string | null;
  length?: number | string | null;
  width?: number | string | null;
  height?: number | string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  product?: Product<TText> | null;
  
  inventory?: Inventory | null;
}

export interface ProductVariantFilters extends PaginationFilters {
  search?: string;
  status?: ProductVariantStatus;
  product_status?: ProductStatus | string;
  product_id?: number | string;
}