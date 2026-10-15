import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/api/client";
import { useLang } from "@/shared/context/LanguageContext";

export interface MenuItem {
  id: number;
  title: string;
  url: string | null;
  is_active?: boolean;
  sort_order?: number;
  nav_menu_id?: number;
  children?: MenuItem[];
}

export interface NavMenuData {
  id?: number;
  name?: string;
  location?: string;
  is_active?: boolean;
  items: MenuItem[];
}

export interface MenuApiResponse {
  status?: string;
  message?: string;
  data?: {
    menu?: NavMenuData;
  };
  menu?: NavMenuData;
}

export const useMenuLinks = (location: string = "header") => {
  const { lang, dir, isRTL } = useLang();

  const query = useQuery({
    queryKey: ["page", "menu-links", location, lang],
    queryFn: async () => {
      const response = await storeApi.getNavigationMenu<MenuApiResponse>(location);
      return response.data;
    },
    select: (response): NavMenuData => {
      const menuData = response?.menu;
      const rawItems = menuData?.items ?? [];

      const items = isRTL ? [...rawItems].reverse() : rawItems;

      return {
        id: menuData?.id ?? 0,
        name: menuData?.name ?? "",
        location: menuData?.location ?? location,
        is_active: menuData?.is_active ?? true,
        items,
      };
    },
    staleTime: 1000 * 60 * 60, // 1 ساعة
  });

  const menuLinks: NavMenuData = query.data ?? {
    id: 0,
    name: "",
    location,
    items: [],
  };

  return {
    ...query,
    menuLinks,
    lang,
    dir,
    isRTL,
  };
};