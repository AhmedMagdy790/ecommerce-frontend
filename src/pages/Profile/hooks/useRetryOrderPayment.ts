import { orderApi } from "@/api/client";
import { useMutation } from "@tanstack/react-query";

interface RetryPaymentVariables {
  orderId: string | number;
  paymentGatewayId?: number;
}

export function useRetryOrderPayment() {
  return useMutation({
    mutationFn: ({ orderId, paymentGatewayId }: RetryPaymentVariables) =>
      orderApi.retryPayment<{ data: { checkout_url: string }}>(orderId, { payment_gateway_id: paymentGatewayId }),

    onSuccess: (response) => {

      const checkoutUrl = response?.data?.checkout_url;

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
      }
    },
  });
}