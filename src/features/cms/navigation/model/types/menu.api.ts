import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { NavigationLocation, NavMenu } from "./navigation.types";
import type { TranslatedText } from "@/shared/types/types";

export type NavMenuSingleResponse = SuccessApiResponse<{ menu: NavMenu<TranslatedText> }>;

export type NavLocationsResponse = SuccessApiResponse<{ locations: NavigationLocation[] }>;

export type NavMenusListResponse = SuccessApiResponse<{
    items: NavMenu<TranslatedText>[];
    pagination: PaginationMeta;
}>;

export type NavMenuDeleteResponse = SuccessApiResponse<null>;