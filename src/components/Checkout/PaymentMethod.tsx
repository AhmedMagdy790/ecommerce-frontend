import { CreditCard, Banknote, Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";

export type PaymentMethodType =
  | "cash"
  | "card"
  | "bank";

interface PaymentMethodProps {
  value: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

export default function PaymentMethod({
  value,
  onChange,
}: PaymentMethodProps) {
  const { t } = useTranslation("checkout");

  const methods = [
    {
      id: "cash" as const,
      icon: <Banknote size={20} />,
      title: t("payment.cash.title"),
      description: t("payment.cash.description"),
    },
    {
      id: "card" as const,
      icon: <CreditCard size={20} />,
      title: t("payment.card.title"),
      description: t("payment.card.description"),
    },
    {
      id: "bank" as const,
      icon: <Landmark size={20} />,
      title: t("payment.bank.title"),
      description: t("payment.bank.description"),
    },
  ];

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
        {methods.map((method) => (
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
                value === method.id
                  ? "border-[var(--color-primary)] bg-[var(--color-surface)]"
                  : "border-[var(--color-border)]"
              }
            `}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={value === method.id}
              onChange={() => onChange(method.id)}
              className="mt-1"
            />

            <div className="text-[var(--color-primary)]">
              {method.icon}
            </div>

            <div>
              <h3 className="font-medium">
                {method.title}
              </h3>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {method.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}