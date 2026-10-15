import { adminApi } from "@/api/client";
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { NavMenu } from "../model/types/navigation.types";
import type { CreateNavMenuItemDto, UpdateNavMenuItemDto } from "../model/types/navigation.dto";
import type { TranslatedText } from "@/shared/types/types";
import type { NavMenuItemDeleteResponse, NavMenuItemResponse } from "../model/types/menuItem.api";

export const menuItemService = {
  // جلب قائمة معينة بكل عناصرها وشجرتها (متوافقة مع دالة show في الـ Controller)
  getItemsByMenuId(menuId: number | string) {
    return adminApi.getMenuById<SuccessApiResponse<{ menu: NavMenu<TranslatedText> }>>(menuId);
  },

  create(menuId: number | string, payload: CreateNavMenuItemDto) {
    return adminApi.createMenuItem<NavMenuItemResponse, CreateNavMenuItemDto>(
      menuId,
      payload
    );
  },

  update(itemId: number | string, payload: UpdateNavMenuItemDto) {
    return adminApi.updateMenuItem<NavMenuItemResponse, UpdateNavMenuItemDto>(
      itemId,
      payload
    );
  },

  delete(itemId: number | string) {
    return adminApi.deleteMenuItem<NavMenuItemDeleteResponse>(itemId);
  },
};

export default menuItemService;