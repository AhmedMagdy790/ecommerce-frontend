// sec/features/dashboard/products/types/api.ts
import type { ApiGalleryImage } from "@/shared/types/media";
import type { ApiVariant } from "@/shared/types/variant";
import type { LocalizedText } from "@/shared/utils/localizedText";

export type Status = "active" | "draft" | "archived";

export interface ApiAdminProduct {
  id: number;

  name: LocalizedText;

  description: LocalizedText;

  slug: string;

  status: Status;

  brand_id: number;
  category_id: number;

  featured_image: string | null;
  thumbnail: string | null;

  gallery: ApiGalleryImage[];

  variants: ApiVariant[];

  created_at: string;
  updated_at: string;
}

