import { adminApi } from "@/api/client";
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { PaymentGateway, PaymentGatewayFilters } from "../model/types/payment.types";
import type {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
} from "../model/types/payment.dto";
import type { PaymentGatewayListResponse } from "../model/types/payment.api";
import type { Option } from "@/shared/components/CustomSelect";

export const paymentGatewayService = {
  getAll(params?: PaymentGatewayFilters) {

    return adminApi.getPaymentGateways<PaymentGatewayListResponse>(params);
  },

  create(payload: CreatePaymentGatewayDto) {
    return adminApi.createPaymentGateway<
      SuccessApiResponse<{ gateway: PaymentGateway }>,
      CreatePaymentGatewayDto
    >(payload);
  },

  update(id: number | string, payload: UpdatePaymentGatewayDto) {
    return adminApi.updatePaymentGateway<
      SuccessApiResponse<{ gateway: PaymentGateway }>,
      UpdatePaymentGatewayDto
    >(id, payload);
  },

  getById(id: number | string) {
    return adminApi.editPaymentGateway<SuccessApiResponse<{ gateway: PaymentGateway }>>(id);
  },

  toggleStatus(id: number | string) {
    return adminApi.togglePaymentGatewayStatus<SuccessApiResponse<{ gateway: PaymentGateway }>>(id);
  },

  toggleTestMode(id: number | string) {
    return adminApi.togglePaymentGatewayTestMode<SuccessApiResponse<{ gateway: PaymentGateway }>>(id);
  },

  delete(id: number | string) {
    return adminApi.deletePaymentGateway<SuccessApiResponse<null>>(id);
  },

  getPaymentGatewayOptions() {
    return adminApi.getPaymentGatewayOptions<SuccessApiResponse<{ options: Option[]}>>()
  }
};

export default paymentGatewayService;