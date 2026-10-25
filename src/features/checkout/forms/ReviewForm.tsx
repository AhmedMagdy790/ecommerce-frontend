// src/pages/Checkout/forms/ReviewForm.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { CheckCircle2, MapPin, Truck, CreditCard, Mail, Phone } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface ReviewFormProps {
  onBack: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
}

export default function ReviewForm({ onBack, onSubmit }: ReviewFormProps) {
  const { t } = useTranslation("checkout");
  const { isRTL, lang } = useLang();
  const { watch, formState: { isSubmitting } } = useFormContext();

  const values = watch();

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      <section className="rounded-panel border border-border bg-surface p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
          <h2 
            className="text-xl font-bold text-text-primary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {t("review.title", { defaultValue: lang === "ar" ? "مراجعة الطلب" : "Review Your Order" })}
          </h2>
        </div>

        <p 
          className="text-sm text-text-secondary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("review.subtitle", { defaultValue: lang === "ar" ? "يرجى مراجعة بياناتك ورسائل التوصيل بعناية قبل إتمام الطلب." : "Please review your information before placing the order." })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Contact & Shipping Address */}
          <div className="rounded-card border border-border p-4 space-y-3 bg-surface-secondary">
            <h3 
              className="font-bold flex items-center gap-2 text-sm text-text-primary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              <MapPin size={16} className="text-primary shrink-0" />
              {t("review.shippingAddress", { defaultValue: lang === "ar" ? "عنوان الشحن والاتصال" : "Shipping Address" })}
            </h3>
            <div className="text-xs text-text-secondary space-y-1">
              <p className="font-bold text-text-primary text-sm">
                {values.customer_name || "-"}
              </p>
              <p>{values.shipping_address}</p>
              {values.shipping_address2 && <p>{values.shipping_address2}</p>}
              <p>{values.city ? (typeof values.city === "object" ? values.city.name : values.city) : "-"}</p>
              {values.country && <p>{values.country}</p>}
            </div>

            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Mail size={14} className="shrink-0" />
                <span>{values.customer_email || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Phone size={14} className="shrink-0" />
                <span>{values.phone_primary || "-"}</span>
              </div>
            </div>
          </div>

          {/* Shipping Method & Payment */}
          <div className="rounded-card border border-border p-4 space-y-4 bg-surface-secondary">
            <div className="space-y-2">
              <h3 
                className="font-bold flex items-center gap-2 text-sm text-text-primary"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                <Truck size={16} className="text-primary shrink-0" />
                {t("review.shippingMethod", { defaultValue: lang === "ar" ? "وسيلة الشحن" : "Shipping Method" })}
              </h3>
              <p className="text-xs font-semibold text-text-primary">
                {values.shipping_method_name || "-"}
              </p>
              {values.shipping_cost !== undefined && (
                <p className="text-xs text-text-secondary">
                  {t("review.shippingCost", { defaultValue: lang === "ar" ? "التكلفة" : "Cost" })}: <span className="font-bold text-text-primary">{values.shipping_cost} {values.currency}</span>
                </p>
              )}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <h3 
                className="font-bold flex items-center gap-2 text-sm text-text-primary"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                <CreditCard size={16} className="text-primary shrink-0" />
                {t("review.paymentMethod", { defaultValue: lang === "ar" ? "طريقة الدفع" : "Payment Method" })}
              </h3>
              <p className="text-xs font-semibold text-text-primary">
                {values.payment_method_name || values.payment_method || "-"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack} disabled={isSubmitting}>
          {t("buttons.back", { defaultValue: lang === "ar" ? "السابق" : "Back" })}
        </Button>

        <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting 
            ? t("buttons.placingOrder", { defaultValue: lang === "ar" ? "جاري إتمام الطلب..." : "Placing Order..." }) 
            : t("buttons.placeOrder", { defaultValue: lang === "ar" ? "تأكيد وإرسال الطلب" : "Place Order" })}
        </Button>
      </div>
    </div>
  );
}