// src/pages/Checkout/components/steps/ShippingStep.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import ShippingMethod from "../ShippingMethod";
import type { ShippingOption } from "@/features/shipping/model/types/shipping.types";

interface ShippingStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ShippingStep({ onNext, onBack }: ShippingStepProps) {
  const { t } = useTranslation("checkout");
  const { watch, setValue, formState: { errors } } = useFormContext();

  const cityId = watch("city_id");
  const selectedShippingId = watch("shipping_method_id");
  const currency = watch("currency") || "USD";

  // استخدام ShippingOption | null بوضوح تام ودون تعقيد
  const handleShippingChange = (option: ShippingOption | null) => {
    if (!option) {
      setValue("shipping_method_id", null, { shouldValidate: true });
      setValue("shipping_cost", 0, { shouldValidate: true });
      return;
    }

    // استخراج السعر سواء كان مخزناً بشكل مباشر أو داخل كائن rates
    const cost = option.rates?.cost ?? option.cost ?? 0;

    setValue("shipping_method_id", String(option.id), { shouldValidate: true });
    setValue("shipping_cost", cost, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <ShippingMethod
        cityId={cityId}
        value={selectedShippingId}
        onChange={handleShippingChange}
        currency={currency}
      />

      {errors.shipping_method_id && (
        <p className="text-xs text-[var(--color-error)] font-medium px-1">
          {String(errors.shipping_method_id.message)}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back", "Back")}
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedShippingId}
        >
          {t("buttons.next", "Continue to Payment")}
        </Button>
      </div>
    </div>
  );
}