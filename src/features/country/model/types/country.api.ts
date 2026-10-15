import type {
  PaginationMeta,
  SuccessApiResponse,
} from "@/shared/types/api.types";

import type {
  Country,
  CountryStats,
} from "./country.types";
import type { TranslatedText } from "@/shared/types/types";

export type CountryListResponse =
  SuccessApiResponse<{
    items: Country<TranslatedText>[];
    pagination: PaginationMeta;
    stats: CountryStats;
  }>;