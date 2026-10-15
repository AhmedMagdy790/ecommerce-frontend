import { adminApi } from "@/api/client";
import type { 
  PaginatedApiResponse, 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import type { NavMenu, NavMenuFilters } from "../model/types/navigation.types";
import type { CreateNavMenuDto, UpdateNavMenuDto } from "../model/types/navigation.dto";
import type { TranslatedText } from "@/shared/types/types";
import type { NavLocationsResponse } from "../model/types/menu.api";


export const menuService = {
  getAll(params?: NavMenuFilters) {
    return adminApi.getMenus<PaginatedApiResponse<NavMenu<TranslatedText>>>(params);
  },

  getById(id: number | string) {
    return adminApi.getMenuById<SuccessApiResponse<{ menu: NavMenu<TranslatedText> }>>(id);
  },

  create(payload: CreateNavMenuDto) {
    return adminApi.createMenu<SuccessApiResponse<{ menu: NavMenu<TranslatedText> }>, CreateNavMenuDto>(
      payload
    );
  },

  update(id: number | string, payload: UpdateNavMenuDto) {
    return adminApi.updateMenu<SuccessApiResponse<{ menu: NavMenu<TranslatedText> }>, UpdateNavMenuDto>(
      id, 
      payload
    );
  },

  delete(id: number | string) {
    return adminApi.deleteMenu<SuccessApiResponse<null>>(id);
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleMenuStatus<SuccessApiResponse<{ menu: NavMenu<TranslatedText> }>>(id);
  },

  getLocations() {
    return adminApi.getLocations<NavLocationsResponse>();
  }
};

export default menuService;