// src/services/paymentService.ts

import { storeApi } from "@/api/client";
import type { PaymentGateway } from "@/shared/types/payment";

export const paymentService = {
  async getPaymentGateways(): Promise<PaymentGateway[]> {
    try {
      const response = await storeApi.getPaymentGateways();

      console.log(response)
      // Adjust based on the actual axios/API response wrapper (e.g., response.data.data or response.data)
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch payment gateways:", error);
      throw error;
    }
  },
};