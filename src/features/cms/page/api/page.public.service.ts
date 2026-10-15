import type { SuccessApiResponse } from "@/shared/types/api.types";
import { storeApi } from "@/api/client";
import type { NavMenuData } from "../public/hooks/useMenuLinks";


export const pagePublicServices = {
  menuLinks(location: string = 'header') {
    return storeApi.getNavigationMenu<
      SuccessApiResponse<{ menu: NavMenuData }>
    >(location);
  },
};

export default pagePublicServices; 