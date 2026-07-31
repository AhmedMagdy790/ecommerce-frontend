// src/pages/Checkout/forms/PaymentForm.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { CreditCard, Wallet, Banknote, ShieldCheck } from "lucide-react";
import { usePaymentGateways } from "../hooks/usePaymentGateways";
import { useCalculateShipping } from "../hooks/useCalculateShipping";
import { useCart } from "@/pages/Cart/hook/useCart";
import { RadioGroup } from "@/shared/components/RadioGroup";

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const { t } = useTranslation("checkout");
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { gateways, loading, error: gatewayError } = usePaymentGateways();

  console.log("errors", errors)
  const currentCityId = watch("city_id");
  const selectedShippingId = watch("shipping_rate_id");
  const selectedPaymentMethod = watch("payment_method");
  
  const { cartItems } = useCart();
  const { mutateAsync: calculateShipping } = useCalculateShipping();

  const handlePaymentChange = (gatewayOptionOrSlug: any) => {
    if (!gatewayOptionOrSlug) {
      setValue("payment_method", "", { shouldValidate: true });
      setValue("payment_method_name", "", { shouldValidate: true });
      setValue("payment_gateway_slug", "", { shouldValidate: true });
      return;
    }

    let selectedGateway: any = null;

    if (typeof gatewayOptionOrSlug === "object" && gatewayOptionOrSlug !== null) {
      selectedGateway = gatewayOptionOrSlug;
    } else {
      selectedGateway = gateways.find(
        (g) => String(g.slug) === String(gatewayOptionOrSlug) || String(g.type) === String(gatewayOptionOrSlug)
      );
    }

    const paymentMethodValue = selectedGateway?.type || selectedGateway?.slug || gatewayOptionOrSlug;
    const paymentMethodName = selectedGateway?.name || gatewayOptionOrSlug;
    const paymentSlug = selectedGateway?.slug || gatewayOptionOrSlug;

    setValue("payment_method", paymentSlug, { shouldValidate: true });
    setValue("payment_method_name", paymentMethodName, { shouldValidate: true });
    setValue("payment_gateway_slug", paymentSlug, { shouldValidate: true });

    if (currentCityId && selectedShippingId && cartItems) {
      const items = cartItems.map(item => ({
        variant_id: item.product_variant_id, 
        quantity: item.quantity
      }));

      calculateShipping({
        city_id: Number(currentCityId),
        shipping_rate_id: Number(selectedShippingId),
        items: items,
        payment_method: paymentMethodValue,
      })
        .then((response) => {
          const result = response?.data ?? response;
          if (result) {
            const newFee = result.actual_shipping_cost ?? result.customer_shipping_cost ?? 0;
            setValue("shipping_cost", Number(newFee), { shouldValidate: true, shouldDirty: true });
          }
        })
        .catch(() => null);
    }
  };

  const getGatewayIcon = (id: string) => {
    switch (id?.toLowerCase()) {
      case "card":
      case "stripe":
      case "paymob":
        return <CreditCard size={22} />;
      case "cod":
      case "cash":
        return <Banknote size={22} />;
      default:
        return <Wallet size={22} />;
    }
  };

  const radioOptions = gateways.map((g) => {
    const gatewayValue = g.type || "online"; 
    
    return {
      value: g.slug,
      label: g.name,
      description: g.description || t("payment.methods.defaultDesc", "Secure payment method."),
      icon: getGatewayIcon(g.slug || gatewayValue),
      originalObject: g,
    };
  });

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("payment.title", "Payment Method")}</h2>
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
          <ShieldCheck size={16} className="text-[var(--color-primary)]" />
          <span>{t("payment.secure", "Secure Checkout")}</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {gatewayError && (
            <p className="text-xs text-[var(--color-error)] px-1">
              {gatewayError}
            </p>
          )}

          <RadioGroup
            name="paymentMethod"
            options={radioOptions}
            value={selectedPaymentMethod}
            allowDeselect={true}
            onChange={handlePaymentChange}
          />
        </div>
      )}

      {errors.payment_method && (
        <p className="text-xs text-[var(--color-error)] font-medium px-1">
          {String(errors.payment_method.message)}
        </p>
      )}

      {/* Notes Field Added for Step 4 Validation */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t("payment.notes", "Order Notes (Optional)")}
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
          placeholder={t("payment.notesPlaceholder", "Notes regarding your order...")}
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
            {String(errors.notes.message)}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back", "Back")}
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedPaymentMethod || loading}
        >
          {t("buttons.next", "Review Order")}
        </Button>
      </div>
    </section>
  );
}