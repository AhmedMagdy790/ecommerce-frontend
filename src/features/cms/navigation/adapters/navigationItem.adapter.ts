import type { PaginationMeta } from "@/shared/types/api.types";
import type { NavMenuItem } from "../model/types/navigation.types";
import type { NavMenuItemResponse, NavMenuItemsListResponse } from "../model/types/menuItem.api";
import type { NavMenuItemFormData } from "../model/schema/navMenuItemSchema";
import type { TranslatedText } from "@/shared/types/types";

export const navigationItemAdapter = {
  fromListResponse(response: NavMenuItemsListResponse): NavMenuItem<TranslatedText>[] {
    return response.data.items;
  },

  fromSingleResponse(response: NavMenuItemResponse): NavMenuItem<TranslatedText> {
    return response.data.item;
  },

  fromCreateResponse(response: NavMenuItemResponse): NavMenuItem<TranslatedText> {
    return response.data.item;
  },

  fromUpdateResponse(response: NavMenuItemResponse): NavMenuItem<TranslatedText> {
    return response.data.item;
  },

  extractPagination(response: NavMenuItemsListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: response.data.items?.length ?? 0,
    };
  },

  toCreateDto(formData: NavMenuItemFormData) {
    return {
      nav_menu_id: formData.nav_menu_id,
      title: formData.title,
      page_id: formData.page_id || null,
      url: formData.url ? formData.url.trim() : null,
      parent_id: formData.parent_id || null,
      sort_order: formData.sort_order ?? 0,
      is_active: formData.is_active ?? true,
    };
  },

  toUpdateDto(formData: NavMenuItemFormData) {
    return {
      nav_menu_id: formData.nav_menu_id,
      title: formData.title,
      page_id: formData.page_id || null,
      url: formData.url ? formData.url.trim() : null,
      parent_id: formData.parent_id || null,
      sort_order: formData.sort_order ?? 0,
      is_active: formData.is_active,
    };
  },
};

export default navigationItemAdapter;