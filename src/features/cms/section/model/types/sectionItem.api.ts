import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { SectionItem } from "./sectionItem.types";
import type { TranslatedText } from "@/shared/types/types";

export type SectionItemListResponse = SuccessApiResponse<{
  items: SectionItem<TranslatedText>[];
  pagination: PaginationMeta;
}>;

export type SectionItemSingleResponse = SuccessApiResponse<{
  item: SectionItem<TranslatedText>;
}>;

export type SectionItemDeleteResponse = SuccessApiResponse<null>;