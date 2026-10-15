import { createFeatureStore } from "@/shared/store/createFeatureStore";
import menuService from "../../api/menuService";
import { navigationAdapter } from "../../adapters/navigation.adapter";
import type { 
  NavMenu, 
  NavMenuFilters
} from "../types/navigation.types";

import type { 
  CreateNavMenuDto, 
  UpdateNavMenuDto 
} from "../types/navigation.dto";

import type { 
  NavMenuDeleteResponse,
  NavMenusListResponse,
  NavMenuSingleResponse 
} from "../types/menu.api";
import type { TranslatedText } from "@/shared/types/types";
import { createNavigationLocationsSlice, type NavigationLocationsState } from "./navigation.actions";

export const useNavigationStore = createFeatureStore<
  NavMenu<TranslatedText>,                          // TModel
  CreateNavMenuDto,                 // TCreateDto
  UpdateNavMenuDto,                 // TUpdateDto
  NavMenuFilters,                   // TFilters
  NavMenusListResponse,             // TListRes
  NavMenuSingleResponse,            // TSingleRes
  NavMenuDeleteResponse,            // TDeleteRes
  NavMenuSingleResponse,            // TUpdateRes
  NavMenusListResponse,             // TTrashRes
  NavMenuSingleResponse,            // TRestoreRes
  NavMenuDeleteResponse,            // TForceDeleteRes
  NavigationLocationsState,            // TCustomState
  boolean                           // TStats
>({
  name: "NavigationStore",

  service: menuService,

  adapter: navigationAdapter,

  defaultFilters: {
    search: "",
    location: "",
    is_active: "",
    
  },

  defaultSortBy: "created_at",

  customActions: ({ set }) => ({
    ...createNavigationLocationsSlice(set),
  }),

  toggle: {
    extractItem:
      navigationAdapter.fromToggleResponse,

    getStatus: (item) =>
      item.is_active ?? false,

    getNextStatus: (currentStatus) => !currentStatus,

    setStatus: (item, status) => ({
      ...item,
      is_active: status,
    }),

    errorMessage: "فشل تغيير حالة القائمة",
  },
});