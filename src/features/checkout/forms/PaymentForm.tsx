// src/pages/Checkout/forms/PaymentForm.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { CreditCard, Wallet, Banknote, ShieldCheck } from "lucide-react";
import { usePaymentGateways } from "../hooks/usePaymentGateways";
import { useCart } from "@/pages/Cart/hook/useCart";
import { RadioGroup, type RadioOption } from "@/shared/components/RadioGroup";
import { shippingService } from "@/services/shippingService";
import { useShippingCalculation } from "../hooks/useShippingCalculation";
import { useLang } from "@/shared/context/LanguageContext";

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const { t } = useTranslation("checkout");
  const { isRTL, lang } = useLang();
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { gateways, loading, error: gatewayError } = usePaymentGateways(watch("country_id"));

  const currentCityId = watch("city_id");
  const selectedShippingId = watch("shipping_rate_id");
  const selectedGatewayId = watch("payment_gateway_id");
  
  const { cartItems } = useCart();

  const { setCalculatingShipping } = useShippingCalculation();

  const handlePaymentChange = (gatewayIdOption: unknown) => {
    if (!gatewayIdOption) {
      setValue("payment_gateway_id", "", { shouldValidate: true });
      setValue("payment_method", "", { shouldValidate: true });
      setValue("payment_method_name", "", { shouldValidate: true });
      setValue("payment_gateway_slug", "", { shouldValidate: true });
      return;
    }

    const selectedGateway = gateways.find(
      (g) => String(g.id) === String(gatewayIdOption) || String(g.slug) === String(gatewayIdOption)
    );

    if (!selectedGateway) return;

    const gatewayId = selectedGateway.id;
    const gatewaySlug = selectedGateway.slug;
    const rawName = selectedGateway.name;

    setValue("payment_gateway_id", Number(gatewayId), { shouldValidate: true, shouldDirty: true });
    setValue("payment_method", gatewaySlug, { shouldValidate: true, shouldDirty: true });
    setValue("payment_method_name", rawName, { shouldValidate: true });
    setValue("payment_gateway_slug", gatewaySlug, { shouldValidate: true });

    if (currentCityId && selectedShippingId && cartItems) {
      const items = cartItems.map(item => ({
        product_variant_id: item.product_variant_id ?? item.id, 
        quantity: item.quantity
      }));

      setCalculatingShipping(true);

      shippingService.calculateShipping({
        city_id: Number(currentCityId),
        shipping_rate_id: Number(selectedShippingId),
        items: items,
        payment_gateway_id: Number(gatewayId),
      })
        .then((calculation) => {
          if (calculation) {
            const totalShippingAndFee = 
              Number(calculation.customer_total_shipping_cost?.amount) || 
              Number(calculation.actual_shipping_cost?.amount) || 
              Number(calculation.customer_shipping_cost?.amount) || 
              0;

            const paymentFee = 
              Number(calculation.payment_fee?.amount) || 
              Number(calculation.breakdown?.payment_fee?.amount) || 
              0;

            const codFee = 
              Number(calculation.breakdown?.cod_fee?.amount) || 
              0;

            setValue("shipping_cost", totalShippingAndFee, { shouldValidate: true, shouldDirty: true });
            setValue("payment_fee", paymentFee, { shouldValidate: true, shouldDirty: true });
            setValue("cod_fee", codFee, { shouldValidate: true, shouldDirty: true });
          }
        })
        .catch(() => null)
        .finally(() => {
          setCalculatingShipping(false);
        });
    }
  };

  const getGatewayIcon = (slug: string) => {
    switch (slug?.toLowerCase()) {
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

  const radioOptions: RadioOption[] = gateways.map((g) => {
    const labelText = g.name;
    const descText = g.description || t("payment.methods.defaultDesc", { defaultValue: lang === "ar" ? "طريقة دفع آمنة ومشفرة." : "Secure payment method." });

    return {
      value: g.id,
      label: labelText,
      description: descText,
      icon: getGatewayIcon(g.slug),
      originalObject: g,
    };
  });

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="rounded-panel border border-border bg-surface p-6 space-y-6 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 
          className="text-xl font-bold text-text-primary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("payment.title", { defaultValue: lang === "ar" ? "طريقة الدفع" : "Payment Method" })}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <ShieldCheck size={16} className="text-primary" />
          <span style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}>
            {t("payment.secure", { defaultValue: lang === "ar" ? "دفع آمن ومحمي" : "Secure Checkout" })}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-card bg-surface-secondary border border-border" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {gatewayError && (
            <p className="text-xs text-red-600 dark:text-red-400 px-1 font-medium">
              {gatewayError}
            </p>
          )}

          <RadioGroup
            name="payment_gateway_id"
            options={radioOptions}
            value={selectedGatewayId}
            allowDeselect={true}
            onChange={handlePaymentChange}
          />
        </div>
      )}

      {errors.payment_gateway_id && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">
          {String(errors.payment_gateway_id.message)}
        </p>
      )}

      <div>
        <label 
          className="block text-sm font-semibold text-text-primary mb-1.5"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("payment.notes", { defaultValue: lang === "ar" ? "ملاحظات الطلب (اختياري)" : "Order Notes (Optional)" })}
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className="w-full rounded-card border border-border bg-surface-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
          placeholder={t("payment.notesPlaceholder", { defaultValue: lang === "ar" ? "ملاحظات بخصوص طلبك، مثال: توصيل في وقت محدد..." : "Notes regarding your order..." })}
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
            {String(errors.notes.message)}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back", { defaultValue: lang === "ar" ? "السابق" : "Back" })}
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedGatewayId || loading}
        >
          {t("buttons.next", { defaultValue: lang === "ar" ? "مراجعة الطلب" : "Review Order" })}
        </Button>
      </div>
    </section>
  );
}