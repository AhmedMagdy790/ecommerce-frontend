import { useTranslation } from "react-i18next";

import CartTotals from "@/components/cart/CartTotals";
import PlaceOrderButton from "./PlaceOrderButton";

interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  loading?: boolean;
  onPlaceOrder?: () => void;
}

export default function CheckoutSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  currency,
  loading = false,
  onPlaceOrder,
}: CheckoutSummaryProps) {
  const { t } = useTranslation("checkout");

  return (
    <aside
      className="
        sticky
        top-24
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-background)]
        p-6
        shadow-sm
      "
    >
      <h2 className="mb-6 text-xl font-semibold">
        {t("summary.title")}
      </h2>

      <CartTotals
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
        discount={discount}
        total={total}
        currency={currency}
      />

      <div className="mt-6 rounded-lg bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
        {t("summary.securePayment")}
      </div>

      <div className="mt-6">
        <PlaceOrderButton
          loading={loading}
          disabled={total <= 0}
          onClick={onPlaceOrder}
        />
      </div>
    </aside>
  );
}