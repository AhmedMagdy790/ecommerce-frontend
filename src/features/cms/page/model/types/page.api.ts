import type {
  PaginationMeta,
  SuccessApiResponse,
} from "@/shared/types/api.types";

import type { Page, PageStats } from "./page.types";
import type { TranslatedText } from "@/shared/types/types";

export type PageListResponse =
  SuccessApiResponse<{
    items: Page<TranslatedText>[],
    pagination: PaginationMeta,
    stats: PageStats
  }>;

export type PageSingleResponse =
  SuccessApiResponse<{
    page: Page<TranslatedText>;
  }>;

export type PageDeleteResponse =
  SuccessApiResponse<null>;