// src/features/shipping/api/shipping-rate.service.ts

import { adminApi } from "@/api/client";

import type { ShippingRateFilters } from "../model/types/rate.types";
import type { CreateShippingRateDto, UpdateShippingRateDto } from "../model/types/shippingRate.dto";
import type { 
  ShippingRateListResponse, 
  ShippingRateSingleResponse, 
  ShippingRateDeleteResponse 
} from "../model/types/shippingRate.api";

export const shippingRateService = {

  getAll(params?: ShippingRateFilters) {
    return adminApi.getShippingRates<ShippingRateListResponse>(params);
  },

  getByCity(cityId: number | string) {
    return adminApi.getCityShippingOptions<ShippingRateListResponse>(cityId);
  },

  create(payload: CreateShippingRateDto) {
    return adminApi.storeShippingRate<ShippingRateSingleResponse, CreateShippingRateDto>(
      payload.city_id,
      payload
    );
  },

  // ✅ التوقيع القياسي المتوافق مع createFeatureStore: update(id, payload)
  update(rateId: number | string, payload: UpdateShippingRateDto) {
    // نفترض أن الـ payload أو العنصر يحتوي على city_id المطلوب للـ Endpoint
    const cityId = payload.city_id;

    if (!cityId) {
      throw new Error("City ID is required to update shipping rate");
    }

    return adminApi.updateShippingRate<ShippingRateSingleResponse, UpdateShippingRateDto>(
      cityId, 
      rateId, 
      payload
    );
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleShippingRateStatus<ShippingRateSingleResponse>(id);
  },

  delete(id: number | string) {
    return adminApi.deleteShippingRate<ShippingRateDeleteResponse>(id);
  }
};

export default shippingRateService;