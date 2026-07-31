// src/pages/Checkout/components/steps/PaymentStep.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { CreditCard, Wallet, Banknote } from "lucide-react";

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const { t } = useTranslation("checkout");
  const { watch, setValue, formState: { errors } } = useFormContext();

  const selectedPaymentMethod = watch("payment_method");

  const handlePaymentChange = (method: string) => {
    setValue("payment_method", method, { shouldValidate: true });
  };

  const paymentMethods = [
    {
      id: "card",
      title: t("payment.methods.card", "Credit / Debit Card"),
      description: t("payment.methods.cardDesc", "Pay securely with Visa, Mastercard, or Mada."),
      icon: <CreditCard size={22} />,
    },
    {
      id: "cod",
      title: t("payment.methods.cod", "Cash on Delivery"),
      description: t("payment.methods.codDesc", "Pay with cash upon receiving your order."),
      icon: <Banknote size={22} />,
    },
    {
      id: "wallet",
      title: t("payment.methods.wallet", "Mobile Wallet"),
      description: t("payment.methods.walletDesc", "Pay using local mobile wallet services."),
      icon: <Wallet size={22} />,
    },
  ];

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 space-y-6">
      <h2 className="text-xl font-semibold">{t("payment.title", "Payment Method")}</h2>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
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
                selectedPaymentMethod === method.id
                  ? "border-[var(--color-primary)] bg-[var(--color-surface)]"
                  : "border-[var(--color-border)]"
              }
            `}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedPaymentMethod === method.id}
              onChange={() => handlePaymentChange(method.id)}
              className="mt-1"
            />

            <div className="text-[var(--color-primary)]">
              {method.icon}
            </div>

            <div className="flex-1">
              <h3 className="font-medium">{method.title}</h3>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {method.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      {errors.payment_method && (
        <p className="text-xs text-[var(--color-error)] font-medium px-1">
          {String(errors.payment_method.message)}
        </p>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back", "Back")}
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedPaymentMethod}
        >
          {t("buttons.next", "Review Order")}
        </Button>
      </div>
    </section>
  );
}