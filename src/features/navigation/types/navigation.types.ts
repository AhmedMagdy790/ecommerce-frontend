// 1. Raw API Response Types (تطابق استجابة السيرفر بدقة)
export interface MenuItemDTO {
  id: number;
  title: string;
  url: string | null;
  slug: string | null;
  is_active?: boolean;
  sort_order?: number;
  nav_menu_id?: number;
  children?: MenuItemDTO[];
}

export interface NavMenuDTO {
  id: number;
  name: string;
  location: string;
  is_active: boolean;
  items: MenuItemDTO[];
}

export interface MenuApiResponse {
  status?: string;
  message?: string;
  data?: {
    menu?: NavMenuDTO;
  };
  menu?: NavMenuDTO;
}

// 2. Domain Domain Models (النموذج المحسّن الجاهز لاستهلاك واجهات الـ UI)
export interface NavLinkItem {
  id: number;
  title: string;
  href: string;
  isExternal: boolean;
  isActive: boolean;
  sortOrder: number;
  children: NavLinkItem[];
}

export interface NavMenu {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
  items: NavLinkItem[];
}