// src/services/shippingService.ts

import { storeApi } from "@/api/client";
import type {
  ShippingCalculationRequest,
  ShippingCalculationResponse,
  ShippingOption,
} from "@/shared/utils/shipping";

export const shippingService = {

  // 1. جلب خيارات الشحن المتاحة لمدينة معينة
  async getShippingOptions(
    data: {
      city_id: number;
      items: ShippingCalculationRequest["items"];
    }
  ): Promise<ShippingOption[]> {

    const response = await storeApi.optionsShipping(data);

    return response.data;
  },

  // 2. حساب تكلفة الشحن
  async calculateShipping(
    data: ShippingCalculationRequest
  ): Promise<ShippingCalculationResponse> {

    const response = await storeApi.calculateShipping(data);
    
    return response.data.shipping_calculation;
  },

  // 3. جلب الأسعار المتاحة لمدينة معينة مع الحساب الفوري (تتطابق مع الـ Endpoint الجديد)
  async getAvailableRates(
    cityId: number | string,
    params: {
      weight: number;
      subtotal: number;
      payment_method?: string;
    }
  ): Promise<ShippingOption[]> {

    const response = await storeApi.availableRatesShipping(cityId, params);

    return response.data;
  },
};