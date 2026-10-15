// src/features/order/model/types/order.api.ts
import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { Order, OrderStatus } from "./order.types";
import type { TranslatedText } from "@/shared/types/types";


export type OrderListResponse = SuccessApiResponse<{
    items: Order<TranslatedText>[];
    pagination: PaginationMeta;
    stats: OrderStatus
}>;
export type OrderSingleResponse = SuccessApiResponse<{ order: Order<TranslatedText> }>;
export type OrderDeleteResponse = SuccessApiResponse<null>;