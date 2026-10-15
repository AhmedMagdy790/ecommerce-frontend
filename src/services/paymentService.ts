// src/services/paymentService.ts

import { storeApi } from "@/api/client";
import type { PaymentGateway } from "@/features/payment/model/types/payment.types";


export const paymentService = {
  async getPaymentGateways(): Promise<PaymentGateway<string>[]> {
    try {
      const response = await storeApi.getPaymentGateways();

      console.log("response", response)
      // Adjust based on the actual axios/API response wrapper (e.g., response.data.data or response.data)
      return response?.data?.gateways;
    } catch (error) {
      console.error("Failed to fetch payment gateways:", error);
      throw error;
    }
  },
};