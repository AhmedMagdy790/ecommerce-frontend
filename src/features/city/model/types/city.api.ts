// src/features/city/types/city.api.ts

import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { City, CityStats } from "./city.types";
import type { TranslatedText } from "@/shared/types/types";



export type CityListResponse =
  SuccessApiResponse<{
    items: City<TranslatedText>[];
    pagination: PaginationMeta;
    stats: CityStats;
  }>;
export type CitySingleResponse = SuccessApiResponse<{ city: City<TranslatedText> }>;

export type CityDeleteResponse = SuccessApiResponse<null>;

export type CityRestoreResponse = SuccessApiResponse<City<TranslatedText>>;