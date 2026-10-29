
import type { TranslatedText } from "@/shared/types/types";
import type { Inventory } from "@/features/inventory/model/types/inventory.types";
import type { Product, ProductStatus } from "@/features/product/model/types/product.types";
import type { PaginationFilters } from "@/shared/types/pagination";

export type ProductVariantStatus = "active" | "inactive" | "archived";

export interface ProductVariantAttributes {
  size?: string;
  color?: string;
  [key: string]: unknown;
}

export interface ProductVariant<TText = TranslatedText | string> {
  id: number;
  product_id: number;
  sku: string;

  // Laravel resource يرجع السعر كنص مثل "150.00"
  price: string | number;

  status: ProductVariantStatus;
  is_available: boolean;

  attributes: ProductVariantAttributes | null;

  weight: number | string;
  length: number | string;
  width: number | string;
  height: number | string;

  product?: Product<TText> | null;
  inventory?: Inventory | null;

  deleted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProductVariantFilters extends PaginationFilters {
  search?: string;
  status?: ProductVariantStatus;
  product_status?: ProductStatus | string;
  product_id?: number | string;
}