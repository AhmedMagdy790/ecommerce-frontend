import type { ApiBrand } from "@/features/brand/types/api";
import type { ApiCategory } from "@/features/category/types/api";
import type { LocalizedText } from "@/shared/utils/localizedText";
import type { ApiVariant } from "@/shared/types/variant";
import type { ApiGalleryImage } from "@/shared/types/media";


export interface ApiProduct {
  id: number;

  name: LocalizedText;

  slug: string;

  description: LocalizedText;

  price: number | null;

  starting_at: number | null;

  thumbnail: string | null;

  featured_image: string | null;

  gallery: ApiGalleryImage[];

  brand: ApiBrand | null;

  category: ApiCategory | null;

  variants: ApiVariant[];

  created_at: string;
}


export interface ApiProductsResponse {
  list: ApiProduct[];

  filters: {
    categories: ApiCategory[];

    price: {
      min: number;
      max: number;
    };
  };

  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface ProductFilters {
  categories?: string[];
  min_price?: string;
  max_price?: string;
  page?: number;
}