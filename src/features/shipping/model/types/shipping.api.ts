// src/features/shipping/model/types/shipping.api.ts
import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { ShippingCourier, ShippingStats } from "./shipping.types";
import type { TranslatedText } from "@/shared/types/types";

export type ShippingCourierListResponse = SuccessApiResponse<{
    items: ShippingCourier<TranslatedText>[],
    pagination: PaginationMeta,
    stats: ShippingStats
}>;
export type ShippingCourierSingleResponse = SuccessApiResponse<{ courier: ShippingCourier<TranslatedText> }>;
export type ShippingCourierDeleteResponse = SuccessApiResponse<null>;  