import type { TranslatedText } from "@/shared/types/types";
import type { ProductFormData } from "../schema/productSchema";
import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";
import type { Category } from "@/features/category/model/types/category.types";
import type { Brand } from "@/features/brand/types/brand.types";
import type { Media } from "@/shared/types/media";

export type InitialProductData = Partial<ProductFormData> & {
  id?: number | string;
  name: TranslatedText;
  description?: TranslatedText | null;

  // Category relations
  category_id?: number | string;
  category?: Category<TranslatedText>;

  // Brand relations (added for consistency with mapper)
  brand_id?: number | string;
  brand?: Brand<TranslatedText>;

  // Variants with localized support
  variants?: ProductVariant<TranslatedText>[] | null;

  // Media & Gallery assets from API
  media?: Media[];
  featured_image?: Media | string | null;
  gallery?: { images: string[] } | any[];

  // Status & Metadata
  status?: "active" | "inactive" | "draft" | string;
  is_featured?: boolean;
};