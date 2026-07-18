import { Truck, Zap, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

export type ShippingMethodType =
  | "standard"
  | "express"
  | "pickup";

export interface ShippingMethodOption {
  id: ShippingMethodType;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

interface ShippingMethodProps {
  value: ShippingMethodType;
  onChange: (method: ShippingMethodType) => void;
  currency?: string;
}

export default function ShippingMethod({
  value,
  onChange,
  currency = "USD",
}: ShippingMethodProps) {
  const { t } = useTranslation("checkout");

  const methods: (ShippingMethodOption & { icon: JSX.Element })[] = [
    {
      id: "standard",
      icon: <Truck size={20} />,
      name: t("shipping.standard.title"),
      description: t("shipping.standard.description"),
      price: 5,
      estimatedDays: t("shipping.standard.estimated"),
    },
    {
      id: "express",
      icon: <Zap size={20} />,
      name: t("shipping.express.title"),
      description: t("shipping.express.description"),
      price: 15,
      estimatedDays: t("shipping.express.estimated"),
    },
    {
      id: "pickup",
      icon: <Package size={20} />,
      name: t("shipping.pickup.title"),
      description: t("shipping.pickup.description"),
      price: 0,
      estimatedDays: t("shipping.pickup.estimated"),
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
        {t("shipping.title")}
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
              name="shippingMethod"
              value={method.id}
              checked={value === method.id}
              onChange={() => onChange(method.id)}
              className="mt-1"
            />

            <div className="text-[var(--color-primary)]">
              {method.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-medium">
                  {method.name}
                </h3>

                <span className="font-semibold">
                  {method.price === 0
                    ? t("shipping.free")
                    : `${currency} ${method.price.toFixed(2)}`}
                </span>
              </div>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {method.description}
              </p>

              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                {method.estimatedDays}
              </p>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}