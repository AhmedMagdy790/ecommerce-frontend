import type { Page } from "@/features/cms/page/model/types/page.types";
import type { PaginationFilters } from "@/shared/types/pagination";
import type { TranslatedText } from "@/shared/types/types";

export interface NavMenuItem<TText = TranslatedText | string> {
  id: number;
  nav_menu_id: number;
  page_id?: number | null;
  title: TText;
  url?: string | null;
  parent_id?: number | null;
  sort_order: number;
  is_active: boolean;
  
  // العلاقات المحملة
  page?: Page | null;
  children?: NavMenuItem<TText>[];
  
  created_at?: string;
  updated_at?: string;
}

export interface NavigationLocation {
  value: string;
  label: TranslatedText;
}

export interface NavMenu<TText = TranslatedText | string> {
  id: number;
  name: string; // اسم القائمة (مثل Main Header, Footer)
  location: string; // مكان العرض (header, footer, mobile)
  is_active: boolean;
  
  // العناصر الرئيسية (الشجرة)
  items?: NavMenuItem<TText>[];
  
  created_at?: string;
  updated_at?: string;
}

export interface NavMenuFilters extends PaginationFilters {
  search?: string;
  location?: string;
  is_active?: boolean | string;
}

// ==========================================
// Initial Data Types (للنماذج Forms والتحرير)
// ==========================================
export type InitialNavMenuData = {
  id?: number;
  name: string;
  location: string;
  is_active: boolean;
};

export type InitialNavMenuItemData = {
  id?: number;
  nav_menu_id: number;
  page?: Page | null;
  title: TranslatedText;
  url?: string | null;
  parent_id?: number | null;
  sort_order: number;
  is_active: boolean;
};