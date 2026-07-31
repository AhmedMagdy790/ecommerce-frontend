// src/pages/Checkout/components/steps/ShippingStep.tsx

import { useFormContext } from "react-hook-form";
import ShippingMethod from "@/components/Checkout/ShippingMethod";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

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

  const handleShippingChange = (methodId: string | number, price: number) => {
    setValue("shipping_method_id", methodId, { shouldValidate: true });
    setValue("shipping_cost", price, { shouldValidate: true });
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