import { createFeatureStore } from "@/shared/store/createFeatureStore";
import menuItemService from "../../api/menuItem.service";
import navigationItemAdapter from "../../adapters/navigationItem.adapter";
import type { 
  NavMenuItem, 
  NavMenuFilters
} from "../types/navigation.types";

import type { 
  CreateNavMenuItemDto, 
  UpdateNavMenuItemDto 
} from "../types/navigation.dto";

import type { 
  NavMenuItemDeleteResponse,
  NavMenuItemsListResponse,
  NavMenuItemResponse 
} from "../types/menuItem.api";
import type { TranslatedText } from "@/shared/types/types";

export const useNavigationItemStore = createFeatureStore<
  NavMenuItem<TranslatedText>,      // TModel -> عنصر القائمة
  CreateNavMenuItemDto,             // TCreateDto
  UpdateNavMenuItemDto,             // TUpdateDto
  NavMenuFilters,                   // TFilters
  NavMenuItemsListResponse,         // TListRes
  NavMenuItemResponse,              // TSingleRes
  NavMenuItemDeleteResponse,        // TDeleteRes
  NavMenuItemResponse,              // TUpdateRes
  NavMenuItemsListResponse,         // TTrashRes
  NavMenuItemResponse,              // TRestoreRes
  NavMenuItemDeleteResponse,        // TForceDeleteRes
  Record<string, never>,            // TCustomState
  boolean                           // TStats
>({
  name: "NavigationItemStore",

service: {
    getAll: async (filters): Promise<NavMenuItemsListResponse> => {
      const menuId: number = Number(filters?.nav_menu_id);

      if (!menuId) {
        return {
          status: "success",
          message: "",
          data: {
            items: [],
          },
        };
      }

      const response = await menuItemService.getItemsByMenuId(menuId);

      const menu = response.data.menu;
      const items = menu.items  || [];

      return {
        status: response.status,
        message: response.message,
        data: {
          items: items,
        },
      };
    },

    create: (dto) => menuItemService.create(dto.nav_menu_id, dto),
    update: (id, dto) => menuItemService.update(id, dto),
    delete: (id) => menuItemService.delete(id),
  },

  adapter: navigationItemAdapter,

  defaultFilters: {
    search: "",
    is_active: "",
    nav_menu_id: ""
  },

  defaultSortBy: "sort_order",

  toggle: {
    extractItem:
      navigationItemAdapter.fromUpdateResponse,

    getStatus: (item) =>
      item.is_active ?? false,

    getNextStatus: (currentStatus) => !currentStatus,

    setStatus: (item, status) => ({
      ...item,
      is_active: status,
    }),

    errorMessage: "فشل تغيير حالة عنصر القائمة",
  },
});