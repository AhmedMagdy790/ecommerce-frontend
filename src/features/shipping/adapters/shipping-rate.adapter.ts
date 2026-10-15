// src/features/shipping/adapters/shipping-rate.adapter.ts

import type { PaginatedApiResponse, PaginationMeta } from "@/shared/types/api.types";
import type { TranslatedText } from "@/shared/types/types";
import type { ShippingRateFormData } from "../model/schema/shippingRateSchema";
import type { CreateShippingRateDto, UpdateShippingRateDto } from "../model/types/shippingRate.dto";
import type { ShippingRate } from "../model/types/rate.types";
import type { ShippingRateSingleResponse } from "../model/types/shippingRate.api";

export const shippingRateAdapter = {
  
  fromListResponse(response: PaginatedApiResponse<ShippingRate<TranslatedText>>): ShippingRate<TranslatedText>[] {
    return response.data.items;
  },

  fromCreateResponse(response: ShippingRateSingleResponse): ShippingRate<TranslatedText> {
    return response.data.rate;
  },

  fromUpdateResponse(response: ShippingRateSingleResponse): ShippingRate<TranslatedText> {
    return response.data.rate;
  },

  fromToggleResponse(response: ShippingRateSingleResponse): ShippingRate<TranslatedText> {

    return response.data.rate;
  },

  extractPagination(response: PaginatedApiResponse<ShippingRate<TranslatedText>>): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  toCreateDto(formData: ShippingRateFormData): CreateShippingRateDto {
    return {
      city_id: formData.city_id,
      shipping_courier_id: formData.shipping_courier_id,
      shipping_fee: formData.shipping_fee,
      estimated_delivery_from: formData.estimated_delivery_from,
      estimated_delivery_to: formData.estimated_delivery_to,
      cod_fee: formData.cod_fee,
      base_cost: formData.base_cost,
      base_weight: formData.base_weight,
      extra_per_kg: formData.extra_per_kg,
      max_weight: formData.max_weight ?? null,
      free_shipping_threshold: formData.free_shipping_threshold ?? null,
      is_active: formData.is_active,
    };
  },

  toUpdateDto(formData: ShippingRateFormData): UpdateShippingRateDto {
    return {
      city_id: formData.city_id,
      shipping_courier_id: formData.shipping_courier_id,
      shipping_fee: formData.shipping_fee,
      estimated_delivery_from: formData.estimated_delivery_from,
      estimated_delivery_to: formData.estimated_delivery_to,
      cod_fee: formData.cod_fee,
      base_cost: formData.base_cost,
      base_weight: formData.base_weight,
      extra_per_kg: formData.extra_per_kg,
      max_weight: formData.max_weight ?? null,
      free_shipping_threshold: formData.free_shipping_threshold ?? null,
      is_active: formData.is_active,
    };
  },
};

export default shippingRateAdapter;