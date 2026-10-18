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

interface PaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentForm({ onNext, onBack }: PaymentFormProps) {
  const { t } = useTranslation("checkout");
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { gateways, loading, error: gatewayError } = usePaymentGateways();

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

      // تشغيل مؤشر التحميل الخاص بالشحن/الرسوم
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
          // إيقاف مؤشر التحميل بغض النظر عن نجاح أو فشل الطلب
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
    const descText = g.description || t("payment.methods.defaultDesc", "Secure payment method.");

    return {
      value: g.id,
      label: labelText,
      description: descText,
      icon: getGatewayIcon(g.slug),
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
            name="payment_gateway_id"
            options={radioOptions}
            value={selectedGatewayId}
            allowDeselect={true}
            onChange={handlePaymentChange}
          />
        </div>
      )}

      {errors.payment_gateway_id && (
        <p className="text-xs text-[var(--color-error)] font-medium px-1">
          {String(errors.payment_gateway_id.message)}
        </p>
      )}

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
          disabled={!selectedGatewayId || loading}
        >
          {t("buttons.next", "Review Order")}
        </Button>
      </div>
    </section>
  );
}