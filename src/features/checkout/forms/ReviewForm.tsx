// src/pages/Checkout/forms/ReviewForm.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { CheckCircle2, MapPin, Truck, CreditCard, Mail, Phone } from "lucide-react";

interface ReviewFormProps {
  onBack: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
}

export default function ReviewForm({ onBack, onSubmit }: ReviewFormProps) {
  const { t } = useTranslation("checkout");
  const { watch, formState: { isSubmitting } } = useFormContext();

  const values = watch();


  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-[var(--color-primary)]" />
          <h2 className="text-xl font-semibold">{t("review.title", "Review Your Order")}</h2>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("review.subtitle", "Please review your information before placing the order.")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Contact & Shipping Address */}
          <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-3 bg-[var(--color-surface)]">
            <h3 className="font-medium flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-[var(--color-primary)]" />
              {t("review.shippingAddress", "Shipping Address")}
            </h3>
            <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
              <p className="font-medium text-[var(--color-text)]">
                {values.customer_name}
              </p>
              <p>{values.shipping_address}</p>
              {values.shipping_address2 && <p>{values.shipping_address2}</p>}
              <p>{values.city ? (typeof values.city === "object" ? values.city.name : values.city) : "-"}</p>
              {values.country && <p>{values.country}</p>}
            </div>

            <div className="border-t border-[var(--color-border)] pt-3 space-y-1">
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                <Mail size={14} />
                <span>{values.customer_email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                <Phone size={14} />
                <span>{values.phone_primary}</span>
              </div>
            </div>
          </div>

          {/* Shipping Method & Payment */}
          <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-4 bg-[var(--color-surface)]">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2 text-sm">
                <Truck size={16} className="text-[var(--color-primary)]" />
                {t("review.shippingMethod", "Shipping Method")}
              </h3>
              <p className="text-xs font-medium text-[var(--color-text)]">
                {values.shipping_method_name || "-"}
              </p>
              {values.shipping_cost !== undefined && (
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {t("review.shippingCost", "Cost")}: {values.shipping_cost} {values.currency}
                </p>
              )}
            </div>

            <div className="border-t border-[var(--color-border)] pt-3 space-y-2">
              <h3 className="font-medium flex items-center gap-2 text-sm">
                <CreditCard size={16} className="text-[var(--color-primary)]" />
                {t("review.paymentMethod", "Payment Method")}
              </h3>
              <p className="text-xs font-medium text-[var(--color-text)]">
                {values.payment_method_name || values.payment_method || "-"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="secondary" onClick={onBack} disabled={isSubmitting}>
          {t("buttons.back", "Back")}
        </Button>

        <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? t("buttons.placingOrder", "Placing Order...") : t("buttons.placeOrder", "Place Order")}
        </Button>
      </div>
    </div>
  );
}