import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { CheckoutFormValues } from "../types/checkout";
import { storeApi } from "@/api/client";
import { useCart } from "@/pages/Cart/hook/useCart";
import { mapCheckoutPayload } from "../adapters/checkoutAdapter";

export function useCheckoutSubmit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cartItems } = useCart();

  const [idempotencyKey] = useState(() =>
    crypto.randomUUID()
  );

  const mutation = useMutation({
    mutationFn: async (formValues: CheckoutFormValues) => {
      const payload = mapCheckoutPayload(
        formValues,
        cartItems,
        idempotencyKey
      );

      const response = await storeApi.submitCheckout(payload, {
        headers: {
          "X-Idempotency-Key": idempotencyKey,
        },
      });

      const data = response.data;

      if (!data?.order?.id) {
        throw new Error(
          "Order was created but its ID was not returned."
        );
      }

      return data;
    },

    onSuccess: async ({ order, payment }) => {
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      if (payment?.requiresRedirect && payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }

      navigate(`/order/success/${order.id}`);
    },
  });

  return {
    submit: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}