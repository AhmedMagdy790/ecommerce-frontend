
import type { Brand } from "@/features/brand/types/brand.types";
import type { Category } from "@/features/category/model/types/category.types";
import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";

export const ProductStatus = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  DRAFT: "draft",
} as const;

export type ProductStatus =
  (typeof ProductStatus)[keyof typeof ProductStatus];

export interface ProductGalleryItem {
  id: number | string;
  url: string;
  name: string;
}

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  trashed: number;
}

export interface Product<TText = Record<string, string> | string> {
  id: number;
  name: TText;
  slug: string;
  description?: TText;
  status: ProductStatus;
  is_featured: boolean;

  price: string | null;
  old_price?: string | number | null;
  starting_at: string | null;

  has_stock?: boolean;

  brand?: Brand<TText> | null;
  category?: Category<TText> | null;
  variants?: ProductVariant<TText>[];

  featured_image: string | null;
  thumbnail: string | null;
  gallery?: ProductGalleryItem[];

  created_at?: string | null;
  updated_at?: string | null;
}

export type ProductSummary = Product;

export interface ProductFilters {
  search?: string;
  name?: string;
  status?: ProductStatus | null;

  brand?: string;
  brand_id?: number | string;
  category_id?: number | string;

  min_price?: number;
  max_price?: number;

  page?: number;
  per_page?: number;
  limit?: number;

  sort?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}