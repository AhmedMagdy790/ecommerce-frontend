import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { NavMenuItem } from "./navigation.types";
import type { TranslatedText } from "@/shared/types/types";

export type NavMenuItemResponse = SuccessApiResponse<{
    item: NavMenuItem<TranslatedText>;
}>;

export type NavMenuItemsListResponse = SuccessApiResponse<{
    items: NavMenuItem<TranslatedText>[];
    pagination?: PaginationMeta;
}>;

export type NavMenuItemDeleteResponse = SuccessApiResponse<null>;