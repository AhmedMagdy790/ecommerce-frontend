// src/services/shippingService.ts

import { storeApi } from "@/api/client";
import type {
  ShippingCalculationRequest,
  ShippingCalculationResponse,
  ShippingOption,
} from "@/shared/utils/shipping";

export const shippingService = {

  async getShippingOptions(
    data: {
      city_id: number;
      items: any[];
    }
  ): Promise<ShippingOption[]> {

    const response = await storeApi.optionsShipping(data);

    return response.data ?? response;
  },


  async calculateShipping(
    data: ShippingCalculationRequest
  ): Promise<ShippingCalculationResponse> {

    const response = await storeApi.calculateShipping(data)

    return response.data ?? response;
  },
};