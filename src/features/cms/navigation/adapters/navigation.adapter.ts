import type { PaginationMeta } from "@/shared/types/api.types";
import type { NavigationLocation, NavMenu } from "../model/types/navigation.types";
import type { NavLocationsResponse, NavMenuSingleResponse, NavMenusListResponse } from "../model/types/menu.api";
import type { NavMenuFormData } from "../model/schema/navMenuSchema";
import type { TranslatedText } from "@/shared/types/types";

export const navigationAdapter = {
  fromListResponse(response: NavMenusListResponse): NavMenu<TranslatedText>[] {
    return response.data.items;
  },

  fromSingleResponse(response: NavMenuSingleResponse): NavMenu<TranslatedText> {
    return response.data.menu;
  },

  fromCreateResponse(response: NavMenuSingleResponse): NavMenu<TranslatedText> {
    return response.data.menu;
  },

  fromUpdateResponse(response: NavMenuSingleResponse): NavMenu<TranslatedText> {
    return response.data.menu;
  },

  fromToggleResponse(response: NavMenuSingleResponse): NavMenu<TranslatedText> {
    return response.data.menu;
  },

  extractLocations(response: NavLocationsResponse): NavigationLocation[] {
    return response.data?.locations ?? [];
  },

  extractPagination(response: NavMenusListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  toCreateDto(formData: NavMenuFormData) {
    return {
      name: formData.name,
      location: formData.location.toLowerCase().trim(),
      is_active: formData.is_active ?? true,
    };
  },

  toUpdateDto(formData: NavMenuFormData) {
    return {
      name: formData.name,
      location: formData.location.toLowerCase().trim(),
      is_active: formData.is_active,
    };
  },
};

export default navigationAdapter;