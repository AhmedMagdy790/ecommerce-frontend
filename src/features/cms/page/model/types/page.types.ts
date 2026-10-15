// src/features/cms/page/model/types/page.types.ts
import type { TranslatedText } from "@/shared/types/types";
import type { Section } from "@/features/cms/section/model/types/section.types";

export interface PageStats {
  total: number;
  active: number;
  inactive: number;
  [key: string]: number;
}

export interface Page<TText = TranslatedText | string> {
  id: number;

  title: TText;
  slug: string;

  content: TranslatedText | null;

  meta_title: TranslatedText | null;
  meta_description: TranslatedText | null;

  is_active: boolean;

  sections?: Section[];

  created_at: string;
  updated_at: string;
}

export interface PageMenuLink {
  id: number;
  title: string;
  slug: string;
}

export interface PageFilters extends Record<string, any> {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  is_active?: string | boolean;
}