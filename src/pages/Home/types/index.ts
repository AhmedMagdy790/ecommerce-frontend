import type { Section } from "../components/SectionRenderer";

export interface HomePageResponse {
    status: string;
    message: string;
    data: {
        page: {
            id: number;
            title: {
                ar: string;
                en: string;
            };
            slug: string;
            content: unknown;
            meta_title: {
                ar: string;
                en: string;
            };
            meta_description: {
                ar: string;
                en: string;
            };
            is_active: boolean;
            sections: Section[];
        };
    };
}


export interface TranslatedString {
  ar: string;
  en: string;
}

export interface SectionItem {
  id: number;
  title: TranslatedString;
  subtitle?: TranslatedString;
  description?: TranslatedString | null;
  image?: string;
  link?: string;
  sort_order: number;
  is_active?: boolean | null;
}


export interface Page {
  id: number;
  title: TranslatedString;
  slug: string;
  content: string | null;
  meta_title: TranslatedString;
  meta_description: TranslatedString;
  is_active: number;
  sections: Section[];
}

export interface HomePageResponse {
  page: Page;
}