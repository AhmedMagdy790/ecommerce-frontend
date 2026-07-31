// src/components/Checkout/PaymentMethod.tsx

import { CreditCard, Banknote, Landmark, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { JSX } from "react";
import { usePaymentGateways } from "@/features/checkout/hooks/usePaymentGateways";

export type PaymentMethodType = string; // Updated to support dynamic gateway slugs/IDs from backend

interface PaymentMethodProps {
  value: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

export default function PaymentMethod({
  value,
  onChange,
}: PaymentMethodProps) {
  const { t, i18n } = useTranslation("checkout");
  const { gateways, loading, error } = usePaymentGateways();


  // Helper to get translated fields (supports Laravel JSON array or regular strings)
  const getLocalizedText = (field: Record<string, string> | string | null): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    
    const currentLocale = i18n.language;
    return field[currentLocale] || field["en"] || Object.values(field)[0] || "";
  };

  // Map slugs/names to icons dynamically (fallback to CreditCard)
  const getGatewayIcon = (slug: string): JSX.Element => {
    switch (slug.toLowerCase()) {
      case "cash":
      case "cash-on-delivery":
      case "cod":
        return <Banknote size={20} />;
      case "bank":
      case "bank-transfer":
        return <Landmark size={20} />;
      default:
        return <CreditCard size={20} />;
    }
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
        <h2 className="mb-6 text-xl font-semibold">{t("payment.title")}</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
        <h2 className="mb-6 text-xl font-semibold">{t("payment.title")}</h2>
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      </section>
    );
  }

  return (
    <section
      className="
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-background)]
        p-6
      "
    >
      <h2 className="mb-6 text-xl font-semibold">
        {t("payment.title")}
      </h2>

      <div className="space-y-4">
        {gateways.map((gateway) => {
          const title = getLocalizedText(gateway.name);
          const description = getLocalizedText(gateway.description);

          return (
            <label
              key={gateway.id}
              className={`
                flex
                cursor-pointer
                items-start
                gap-4
                rounded-lg
                border
                p-4
                transition-colors
                ${
                  value === gateway.slug
                    ? "border-[var(--color-primary)] bg-[var(--color-surface)]"
                    : "border-[var(--color-border)]"
                }
              `}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={gateway.slug}
                checked={value === gateway.slug}
                onChange={() => onChange(gateway.slug)}
                className="mt-1"
              />

              <div className="text-[var(--color-primary)]">
                {getGatewayIcon(gateway.slug)}
              </div>

              <div>
                <h3 className="font-medium">
                  {title}
                </h3>

                {description && (
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}