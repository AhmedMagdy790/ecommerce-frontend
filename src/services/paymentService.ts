// src/services/paymentService.ts

import { storeApi } from "@/api/client";
import type { PaymentGateway } from "@/features/payment/model/types/payment.types";

export const paymentService = {
  async getPaymentGateways(
    countryId: number,
  ): Promise<PaymentGateway<string>[]> {
    const response = await storeApi.getPaymentGateways({
      country_id: countryId,
    });

    return response.data.gateways;
  },
};