// src/pages/Checkout/hooks/useCheckoutValidation.ts

import { type FieldValues, type Path, type UseFormTrigger } from "react-hook-form";
import type { CheckoutFormValues } from "../types/checkout";

export function useCheckoutValidation<TFieldValues extends FieldValues = CheckoutFormValues>(
  trigger: UseFormTrigger<TFieldValues>
) {
  const STEP_FIELDS: Record<number, Path<TFieldValues>[]> = {
    1: [
      "customer_name" as Path<TFieldValues>,
      "phone_primary" as Path<TFieldValues>,
      "phone_secondary" as Path<TFieldValues>,
      "customer_email" as Path<TFieldValues>,
    ],
    2: [
      "shipping_address" as Path<TFieldValues>,
      "shipping_address2" as Path<TFieldValues>,
      "city_id" as Path<TFieldValues>,
    ],
    3: [
      "shipping_rate_id" as Path<TFieldValues>,
    ],
    4: [
      "payment_gateway_id" as Path<TFieldValues>,
      "notes" as Path<TFieldValues>,
    ],
    5: [
      // الخطوة الخامسة هي المراجعة والإرسال النهائي (ReviewForm) وغالباً لا تحتاج حقول جديدة للتحقق قبل الإرسال لأنها مراجعة شاملة
    ],
  };

  const validateStep = async (step: number) => {
    const fields = STEP_FIELDS[step];
    if (!fields || fields.length === 0) return true;

    return trigger(fields);
  };

  return {
    validateStep,
  };
}