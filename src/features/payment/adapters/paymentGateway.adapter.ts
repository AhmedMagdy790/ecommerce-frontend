// src/features/payment/adapters/paymentGateway.adapter.ts

import type {
  PaginatedApiResponse,
  PaginationMeta,
  SuccessApiResponse,
} from "@/shared/types/api.types";

import type { PaymentGateway, PaymentGatewayStats } from "../model/types/payment.types";
import type { PaymentGatewayFormData } from "../model/schema/paymentGatewaySchema";
import type {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
} from "../model/types/payment.dto";
import type { PaymentGatewayListResponse, PaymentGatewaySingleResponse } from "../model/types/payment.api";
import { extractStatsSafely } from "@/shared/utils/helper";


export const paymentGatewayAdapter = {
  fromListResponse(response: PaginatedApiResponse<PaymentGateway>): PaymentGateway[] {
    return response.data.items;
  },

  fromCreateResponse(response: SuccessApiResponse<{ gateway: PaymentGateway }>): PaymentGateway {
    return response.data.gateway;
  },

  fromUpdateResponse(response: SuccessApiResponse<{ gateway: PaymentGateway }>): PaymentGateway {
    return response.data.gateway;
  },

  fromToggleResponse(response: PaymentGatewaySingleResponse): PaymentGateway {
    return response.data.gateway;
  },

  extractStats(response: PaymentGatewayListResponse): PaymentGatewayStats {
    return extractStatsSafely(response?.data?.stats, {
      total: 0,
      active: 0,
      inactive: 0
    });
  },

  extractPagination(response: PaginatedApiResponse<PaymentGateway>): PaginationMeta {
    return (
      response.data.pagination ?? {
        type: "server",
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      }
    );
  },

  toCreateDto(formData: PaymentGatewayFormData): CreatePaymentGatewayDto {
    return {
      name: formData.name,
      slug: formData.slug,
      type: formData.type,
      description: formData.description ?? null,
      credentials: formData.credentials ?? null,
      is_active: formData.is_active ?? true,
      is_test_mode: formData.is_test_mode ?? false,
      icon_name: formData.icon_name ?? null,
      extra_fees: formData.extra_fees ?? 0,
      ...(formData.logo instanceof File ? { logo: formData.logo } : {}),
    };
  },

  toUpdateDto(formData: PaymentGatewayFormData): UpdatePaymentGatewayDto {
    return {
      name: formData.name,
      slug: formData.slug,
      type: formData.type,
      description: formData.description ?? null,
      credentials: formData.credentials ?? null,
      is_active: formData.is_active,
      is_test_mode: formData.is_test_mode,
      icon_name: formData.icon_name,
      extra_fees: formData.extra_fees,
      ...(formData.logo instanceof File ? { logo: formData.logo } : {}),
    };
  },
};

export default paymentGatewayAdapter;