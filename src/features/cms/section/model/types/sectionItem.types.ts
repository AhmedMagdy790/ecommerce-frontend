import type { TranslatedText } from "@/shared/types/types";
import type { Product } from "@/features/product/model/types/product.types";

export interface SectionItem<TText = TranslatedText | string> {
  id: number;
  section_id: number;

  title: TText;
  subtitle: TText;
  description?: TText;

  image: string | null;
  link: string | null;

  product_id: number | null;

  sort_order: number;

  data: Record<string, unknown> | unknown[] | null;

  product?: Product<TText> | null;

  button_text?: TText | null;
  action_text?: TText | null;
  float_title?: TText | null;
  float_subtitle?: TText | null;
  stat_number?: TText | null;
  stat_text?: TText | null;

  [key: `float_${string}`]: any;
  [key: string]: any;
}

export interface StoreSectionItemPayload {
  section_id?: number;
  title?: TranslatedText | null;
  subtitle?: TranslatedText | null;
  description?: TranslatedText | null;
  image?: string | null;
  link?: string | null;
  product_id?: number | null;
  sort_order?: number;

  button_text?: TranslatedText | null;
  action_text?: TranslatedText | null;
  float_title?: TranslatedText | null;
  float_subtitle?: TranslatedText | null;
  stat_number?: TranslatedText | null;
  stat_text?: TranslatedText | null;

  data?: Record<string, unknown> | unknown[] | null;

  [key: `float_${string}`]: any;
  [key: string]: any;
}

export type UpdateSectionItemPayload = Partial<StoreSectionItemPayload>;

export interface ReorderSectionItemsPayload {
  items: number[];
}