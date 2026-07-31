// src/pages/Checkout/hooks/useCheckoutSubmit.ts

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CheckoutFormValues } from "../types/checkout";
import { orderApi } from "@/api/client";
import { useCart } from "@/pages/Cart/hook/useCart";
import { mapCheckoutPayload } from "../adapters/checkoutAdapter";

export function useCheckoutSubmit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { cartItems } = useCart();

  const mutation = useMutation({
    mutationFn: async ({ payload, idempotencyKey }: { payload: any; idempotencyKey: string }) => {


      const response = await orderApi.createOrder(payload, {
        headers: {
          "X-Idempotency-Key": idempotencyKey,
        },
      });
      return response?.data ?? response;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      const orderId = data?.id || data?.order?.id || Date.now();
      navigate(`/order/success/${orderId}`);
    },
    onError: (err: any) => {
      const errorMessage = 
        err?.response?.data?.message || 
        err?.message || 
        "Failed to place order. Please try again.";
      setSubmitError(errorMessage);
    },
  });

  const submit = async (data: CheckoutFormValues) => {
    try {
      setSubmitError(null);
      
      // استخراج الـ idempotency_key وفصل باقي بيانات النموذج
      const { idempotency_key, ...formValues } = data;
      const payload = mapCheckoutPayload(formValues, cartItems);

      return await mutation.mutateAsync({ 
        payload, 
        idempotencyKey: idempotency_key 
      });
    } catch (error) {
      console.error("Checkout submission error:", error);
    }
  };

  return {
    submit,
    loading: mutation.isPending,
    error: submitError,
  };
}