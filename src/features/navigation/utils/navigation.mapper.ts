import type { MenuItemDTO, NavLinkItem, NavMenuDTO, NavMenu } from "../types/navigation.types";


const isExternalUrl = (url: string): boolean => {
  return /^https?:\/\//i.test(url);
};


export const transformMenuItem = (item: MenuItemDTO): NavLinkItem => {
  const rawUrl = item.url?.trim();
  const rawSlug = item.slug?.trim();

  let href = "#";
  let isExternal = false;

  if (rawUrl) {
    href = rawUrl;
    isExternal = isExternalUrl(rawUrl);
  } else if (rawSlug) {
    href = rawSlug.startsWith("/") ? rawSlug : `/pages/${rawSlug}`;
  }

  return {
    id: item.id,
    title: item.title ?? "",
    href,
    isExternal,
    isActive: Boolean(item.is_active),
    sortOrder: item.sort_order ?? 0,
    children: Array.isArray(item.children) 
      ? item.children.map(transformMenuItem) 
      : [],
  };
};

/**
 * تحويل كائن القائمة الكامل وتطبيق معايير الـ LTR / RTL
 */
export const transformNavMenu = (
  dto: NavMenuDTO | undefined,
  fallbackLocation: string,
  isRTL: boolean
): NavMenu => {
  if (!dto) {
    return {
      id: 0,
      name: "",
      location: fallbackLocation,
      isActive: false,
      items: [],
    };
  }

  const mappedItems = (dto.items ?? []).map(transformMenuItem);
  const items = isRTL ? mappedItems.reverse() : mappedItems;

  return {
    id: dto.id,
    name: dto.name,
    location: dto.location || fallbackLocation,
    isActive: dto.is_active,
    items,
  };
};