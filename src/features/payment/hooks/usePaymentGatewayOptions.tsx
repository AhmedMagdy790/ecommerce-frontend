// src/features/payment/hooks/usePaymentGatewayOptions.ts

import type { Option } from "@/shared/components/CustomSelect";
import { useQuery } from "@tanstack/react-query";

import paymentGatewayService from "../api/paymentGateway.service";

export function usePaymentGatewayOptions() {
  const query = useQuery<Option[]>({
    queryKey: ["payment-gateway-options"],
    queryFn: async () => {
      const response = await paymentGatewayService.getPaymentGatewayOptions();

      return response.data.options ?? [];
    },
    staleTime: 60 * 60 * 1000,
  });

  return {
    gatewayOptions: query.data ?? [],
    isGatewaysLoading: query.isLoading,
    isGatewaysError: query.isError,
    gatewayOptionsError: query.error,
  };
}