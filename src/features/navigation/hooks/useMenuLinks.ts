
import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/api/client";
import { useLang } from "@/shared/context/LanguageContext";
import type { MenuApiResponse, NavMenu } from "../types/navigation.types";
import { transformNavMenu } from "../utils/navigation.mapper";
import { navigationKeys } from "../api/navigation.keys";
import { useCallback } from "react";

export const useMenuLinks = (location: string = "header") => {
  const { lang, dir, isRTL } = useLang();

  const selectMenu = useCallback(
    (response: MenuApiResponse): NavMenu =>
      transformNavMenu(response?.menu, location, isRTL),
    [location, isRTL],
  );

  const query = useQuery({
    queryKey: navigationKeys.menuByLocation(location, lang),
    queryFn: async () => {
      const response = await storeApi.getNavigationMenu<MenuApiResponse>(
        location,
      );
      return response.data ?? {};
    },
    select: selectMenu,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const menuLinks: NavMenu =
    query.data ?? transformNavMenu(undefined, location, isRTL);

  return {
    ...query,
    menuLinks,
    lang,
    dir,
    isRTL,
    isFetching: query.isFetching,
  };
};
