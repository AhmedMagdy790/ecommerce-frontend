// src/features/payment/model/types/payment.api.ts
import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { PaymentGateway, PaymentGatewayStats } from "./payment.types";


export type PaymentGatewayListResponse = SuccessApiResponse<{
    items: PaymentGateway[];
      pagination: PaginationMeta;
    stats: PaymentGatewayStats;
}>;
export type PaymentGatewaySingleResponse = SuccessApiResponse<{ gateway: PaymentGateway }>;
export type PaymentGatewayDeleteResponse = SuccessApiResponse<null>;