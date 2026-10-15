// src/features/shipping/model/types/shippingRate.api.ts
import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { ShippingRate, ShippingRateStats } from "./rate.types";
import type { TranslatedText } from "@/shared/types/types";

export type ShippingRateListResponse = SuccessApiResponse<{
    items: ShippingRate<TranslatedText>[];
    pagination: PaginationMeta;
    stats: ShippingRateStats
}>;

export type ShippingRateSingleResponse = SuccessApiResponse<{ rate: ShippingRate<TranslatedText> }>;

export type ShippingRateDeleteResponse = SuccessApiResponse<null>;