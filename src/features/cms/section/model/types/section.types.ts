// src/features/cms/section/model/types/section.types.ts

import type { TranslatedText } from "@/shared/types/types";
import type { PaginationFilters } from "@/shared/types/pagination";
import type { SectionItem } from "./sectionItem.types";

export const SectionTypes = {
  HERO: "hero",
  SLIDER: "slider",
  PRODUCTS: "products",
  CATEGORY: "category",
  BRANDS: "brands",
  BANNER: "banner",
  SERVICES: "services",
  TESTIMONIALS: "testimonials",
  NEWSLETTER: "newsletter",
  WHYCHOOSEUS: "why_choose_us",
  TEXT: "text",
} as const;

export type SectionType = (typeof SectionTypes)[keyof typeof SectionTypes];

export interface SectionSettings {
  layout?: string;
  auto_play?: boolean;
  interval?: number;
  show_badges?: boolean;
  grid_columns?: number;
  [key: string]: unknown;
}

export interface Section<TText = TranslatedText | string> {
  id: number;
  page_id: number;

  name: TText;
  key: string;
  type: SectionType;

  sort_order: number;
  is_active: boolean;

  settings: SectionSettings | null;

  // الحقول الإضافية التي قد تأتي مباشرة مع القسم
  title?: TText;
  subtitle?: TText;
  description?: TText;
  image?: string | null;
  link?: string | null;

  // دعم كلاً من data و items لتوافق شامل
  data?: SectionItem<TText>[];

  products?: SectionProduct[];
  categories?: SectionCategory[];
  brands?: SectionBrand[];

  created_at: string;
  updated_at: string;

  // السماح بخصائص إضافية ديناميكية دون التضحية بدقة Type Safety
  [key: `float_${string}`]: unknown;
  [key: string]: unknown;
}

export interface SectionFilters extends PaginationFilters {
  search?: string;
  is_active?: boolean | string;
  type?: SectionType | string;
  page_id?: number;
}

export interface SectionProduct {
  id: number;
  name: TranslatedText | string;
  pivot: {
    section_id: number;
    product_id: number;
    sort_order: number;
  };
}

export interface SectionCategory {
  id: number;
  name: TranslatedText | string;
  pivot: {
    section_id: number;
    category_id: number;
    sort_order: number;
  };
}

export interface SectionBrand {
  id: number;
  name: TranslatedText | string;
  pivot: {
    section_id: number;
    brand_id: number;
    sort_order: number;
  };
}