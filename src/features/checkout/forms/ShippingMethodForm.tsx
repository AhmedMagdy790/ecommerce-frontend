// src/pages/Checkout/forms/ShippingMethodForm.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

import { useCart } from "@/pages/Cart/hook/useCart";
import ShippingMethod from "../components/ShippingMethod";
import { shippingService } from "@/services/shippingService";
import type { ShippingOption } from "@/features/shipping/model/types/shipping.types";
import { useLang } from "@/shared/context/LanguageContext";

interface ShippingMethodFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ShippingMethodForm({ onNext, onBack }: ShippingMethodFormProps) {
  const { t } = useTranslation("checkout");
  const { isRTL, lang } = useLang();
  const { watch, setValue, formState: { errors } } = useFormContext();

  const currentCityId = watch("city_id");
  const selectedShippingId = watch("shipping_rate_id");
  const currency = watch("currency") || "EGY";
  const { cartItems } = useCart();

  const handleShippingChange = async (option: ShippingOption | null) => {
    if (!option) {
      setValue("shipping_rate_id", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("shipping_cost", 0, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("shipping_method_name", "", {
        shouldValidate: true,
      });
      return;
    }

    const targetRateId = option.shipping_rate_id ?? option.id;

    // Check for deselection before updating the selected ID
    if (
      selectedShippingId != null &&
      selectedShippingId !== "" &&
      String(selectedShippingId) === String(targetRateId)
    ) {
      setValue("shipping_rate_id", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("shipping_cost", 0, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("shipping_method_name", "", {
        shouldValidate: true,
      });
      return;
    }

    // Set the selected rate before awaiting the calculation
    setValue("shipping_rate_id", Number(targetRateId), {
      shouldValidate: true,
      shouldDirty: true,
    });

    const items = cartItems?.map(item => ({
      product_variant_id: item.product_variant_id ?? item.id,
      quantity: item.quantity,
    })) ?? [];

    const calculation = await shippingService.calculateShipping({
      city_id: Number(currentCityId),
      shipping_rate_id: Number(targetRateId),
      items,
      payment_gateway_id: undefined,
    }).catch((err) => {
      console.error("Calculate shipping error:", err);
      return null;
    });

    // Extract fee and currency accurately from API response objects
    const fee = 
      Number(calculation?.actual_shipping_cost?.amount) || 
      Number(calculation?.customer_shipping_cost?.amount) || 
      Number(calculation?.customer_total_shipping_cost?.amount) || 
      Number(calculation?.base_fee?.amount) || 
      Number(option.shipping_details?.shipping_fee) || 
      Number(option.rates?.cost) || 
      0;

    const optionCurrency = 
      calculation?.customer_shipping_cost?.currency ?? 
      calculation?.actual_shipping_cost?.currency ?? 
      option.shipping_details?.currency ?? 
      currency;

    const shippingName = option.name ?? `Shipping Method #${targetRateId}`;

    // Update form context state
    setValue("shipping_cost", Number(fee), { shouldValidate: true, shouldDirty: true });
    setValue("currency", optionCurrency, { shouldValidate: true, shouldDirty: true });
    setValue("shipping_method_name", shippingName, { shouldValidate: true });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      <ShippingMethod
        cityId={currentCityId}
        value={selectedShippingId}
        onChange={handleShippingChange}
        currency={currency}
      />

      {errors.shipping_rate_id && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">
          {String(errors.shipping_rate_id.message)}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back", { defaultValue: lang === "ar" ? "السابق" : "Back" })}
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedShippingId}
        >
          {t("buttons.next", { defaultValue: lang === "ar" ? "المتابعة إلى الدفع" : "Continue to Payment" })}
        </Button>
      </div>
    </div>
  );
}