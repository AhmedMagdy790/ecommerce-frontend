// src/features/product/types/product.types.ts
import type { TranslatedText } from "@/shared/types/types";
import type { Brand } from "@/features/brand/types/brand.types";
import type { Media } from "@/shared/types/media";
import type { Category } from "@/features/category/model/types/category.types";
import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";

export type LocalizedString = TranslatedText;

export interface ProductMedia extends Media {
  url: string;
}

// src/features/product/types/product.types.ts (أو مكان مناسب)

export const ProductStatus = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  DRAFT: "draft",
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  trashed: number;
}


export interface Product<TText = TranslatedText | string> {
  id: number | string;
  name: TText;
  slug: string;
  description?: TText;
  category_id?: number | string;
  brand_id?: number | string;
  brand?: Brand<TText>;
  status: ProductStatus;
  is_featured: boolean;
  category?: Category<TText>;

  variants?: ProductVariant[] | any;

  link?: string;

  media?: Media[];
  featured_image?: Media | string | null;
  thumbnail?: string;
  gallery?: { images: string[] };
  
  image?: string;
  price?: number;
  starting_at?: number;
  oldPrice?: number;
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  reviews?: any[];
  relatedProducts?: any[];

  created_at?: string;
  updated_at?: string;
}

export type ProductSummary = Product;


export interface ProductFilters {
  search?: string;
  name?: string;
  status?: string | null;
  brand?: string;
  category_id?: number | string;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";

  [key: string]: any;
}