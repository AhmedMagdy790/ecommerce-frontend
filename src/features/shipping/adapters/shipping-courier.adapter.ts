// src/features/shipping/adapters/shipping-courier.adapter.ts
import type { PaginatedApiResponse, PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";

import type { TranslatedText } from "@/shared/types/types";
import type { ShippingCourierFormData } from "../model/schema/shippingCourierSchema";
import type { CreateShippingCourierDto, UpdateShippingCourierDto } from "../model/types/shipping.dto";
import type { ShippingCourier, ShippingStats } from "../model/types/shipping.types";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { ShippingCourierListResponse } from "../model/types/shipping.api";

export const shippingCourierAdapter = {
  fromListResponse(response: PaginatedApiResponse<ShippingCourier<TranslatedText>>): ShippingCourier<TranslatedText>[] {
    return response.data.items;
  },

  fromCreateResponse(response: SuccessApiResponse<{ courier: ShippingCourier<TranslatedText> }>): ShippingCourier<TranslatedText> {
    return response.data.courier;
  },

  fromUpdateResponse(response: SuccessApiResponse<{ courier: ShippingCourier<TranslatedText> }>): ShippingCourier<TranslatedText> {
    return response.data.courier;
  },

  fromToggleResponse(response: SuccessApiResponse<{ courier: ShippingCourier<TranslatedText> }>): ShippingCourier<TranslatedText> {
    return response.data.courier;
  },

  extractPagination(response: PaginatedApiResponse<ShippingCourier<TranslatedText>>): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    }
  },
  
  extractStats(response: ShippingCourierListResponse): ShippingStats {
    return extractStatsSafely(response?.data?.stats, {
      total: 0,
      active: 0,
      inactive: 0,
      trashed: 0
    });
  },

  toCreateDto(formData: ShippingCourierFormData): CreateShippingCourierDto {
    return {
      name: formData.name,
      code: formData.code,
      phone: formData.phone || null,
      email: formData.email || null,
      api_endpoint: formData.api_endpoint || null,
      api_key: formData.api_key || null,
      description: formData.description ?? getEmptyTranslatedObject(),
      supports_cod: formData.supports_cod,
      tracking_url: formData.tracking_url || null,
      is_active: formData.is_active,
      driver: formData.driver || null,
      ...(formData.logo ? { logo: formData.logo } : {}),
    };
  },

  toUpdateDto(formData: ShippingCourierFormData): UpdateShippingCourierDto {
    return {
      name: formData.name,
      code: formData.code,
      phone: formData.phone || null,
      email: formData.email || null,
      api_endpoint: formData.api_endpoint || null,
      api_key: formData.api_key || null,
      description: formData.description ?? getEmptyTranslatedObject(),
      supports_cod: formData.supports_cod,
      tracking_url: formData.tracking_url || null,
      is_active: formData.is_active,
      driver: formData.driver || null,
      ...(formData.logo ? { logo: formData.logo } : {}),
    };
  },
};

export default shippingCourierAdapter;