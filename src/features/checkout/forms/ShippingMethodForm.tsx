// src/pages/Checkout/forms/ShippingMethodForm.tsx

import { useFormContext } from "react-hook-form";
import ShippingMethod from "@/components/Checkout/ShippingMethod";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import type { ShippingOption } from "../types/checkout";
import { useCalculateShipping } from "../hooks/useCalculateShipping";

import { useCart } from "@/pages/Cart/hook/useCart";

interface ShippingMethodFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ShippingMethodForm({ onNext, onBack }: ShippingMethodFormProps) {
  const { t } = useTranslation("checkout");
  const { watch, setValue, formState: { errors } } = useFormContext();

  console.log("errors", errors);
  const currentCityId = watch("city_id");
  // تم تغييرها لتتطابق مع shipping_rate_id المستخدم في الـ schema و الـ setValue
  const selectedShippingId = watch("shipping_rate_id");
  const currency = watch("currency") || "USD";
  const { cartItems } = useCart();

  const { mutateAsync: calculateShipping } = useCalculateShipping();

  const handleShippingChange = async (option: ShippingOption | null) => {
    if (!option) {
      setValue("shipping_rate_id", "", { shouldValidate: true, shouldDirty: true });
      setValue("shipping_cost", 0, { shouldValidate: true, shouldDirty: true });
      setValue("shipping_method_name", "", { shouldValidate: true });
      return;
    }

    const targetRateId = option.shipping_rate_id ?? option.id;

    if (selectedShippingId !== undefined && selectedShippingId !== null && String(selectedShippingId) === String(targetRateId)) {
      setValue("shipping_rate_id", "", { shouldValidate: true, shouldDirty: true });
      setValue("shipping_cost", 0, { shouldValidate: true, shouldDirty: true });
      setValue("shipping_method_name", "", { shouldValidate: true });
      return;
    }

    const items = cartItems?.map(item => ({
      variant_id: item.product_variant_id, 
      quantity: item.quantity
    }));

    const response = await calculateShipping({
      city_id: Number(currentCityId),
      shipping_rate_id: Number(targetRateId),
      items: items,
    }).catch(() => null);

    const result = response?.data ?? response;

    const fee = 
      result?.actual_shipping_cost ?? 
      result?.customer_shipping_cost ?? 
      result?.shipping_fee ?? 
      option.shipping_details?.shipping_fee ?? 
      option.rates?.final_price ?? 
      option.rates?.cost ?? 
      0;

    const optionCurrency = result?.currency ?? option.shipping_details?.currency ?? currency;
    const shippingName = option.name ?? option.title ?? `Shipping Method #${targetRateId}`;

    setValue("shipping_rate_id", Number(targetRateId), { shouldValidate: true, shouldDirty: true });
    setValue("shipping_cost", Number(fee), { shouldValidate: true, shouldDirty: true });
    setValue("currency", optionCurrency, { shouldValidate: true, shouldDirty: true });
    setValue("shipping_method_name", shippingName, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <ShippingMethod
        cityId={currentCityId}
        value={selectedShippingId}
        onChange={handleShippingChange}
        currency={currency}
      />

      {/* تم تعديل عرض الخطأ هنا ليطابق shipping_rate_id بدلاً من shipping_courier_id */}
      {errors.shipping_rate_id && (
        <p className="text-xs text-[var(--color-error)] font-medium px-1">
          {String(errors.shipping_rate_id.message)}
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