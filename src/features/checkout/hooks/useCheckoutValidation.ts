// src/pages/Checkout/hooks/useCheckoutValidation.ts

import { type UseFormTrigger } from "react-hook-form";
import type { CheckoutFormValues } from "../types/checkout";

export function useCheckoutValidation(trigger: UseFormTrigger<CheckoutFormValues>) {
  const STEP_FIELDS: Record<number, (keyof CheckoutFormValues)[]> = {
    1: [
      "customer_name",
      // "customer_type",
      "phone_primary",
      "phone_secondary",
      "customer_email",
    ],
    2: [
      "shipping_address",
      "shipping_address2",
      "city_id",
    ],
    3: [
      "shipping_rate_id",
      "notes"
    ],
    4: [
      "payment_method",
      // "items",
      "coupon_code",
      "notes",
    ],
  };

  const validateStep = async (step: number) => {
    const fields = STEP_FIELDS[step];
    if (!fields) return true;

    return trigger(fields);
  };

  return {
    validateStep,
  };
}