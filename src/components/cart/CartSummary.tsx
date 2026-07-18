import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

import CartTotals from "./CartTotals";
import CheckoutButton from "./CheckoutButton";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  loading?: boolean;
}

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  currency,
  loading = false,
}: CartSummaryProps) {
  const { t } = useTranslation("cart");
  const navigate = useNavigate();


  const handleCheckout = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  return (
<aside
  aria-labelledby="cart-summary-title"
  className="
    sticky
    top-[calc(var(--header-height)+var(--spacing-4))]

    rounded-2xl
    border border-border/60
    bg-surface

    p-6

    shadow-sm
    hover:shadow-lg
    transition-all
    duration-300

    backdrop-blur-sm
  "
>
  <h2
    id="cart-summary-title"
    className="
      mb-6
      border-b
      border-border/50
      pb-4
      text-xl
      font-semibold
      text-text-primary
    "
  >
    {t("summary.title")}
  </h2>

  <div className="space-y-6">
    <CartTotals
      subtotal={subtotal}
      shipping={shipping}
      tax={tax}
      discount={discount}
      total={total}
      currency={currency}
    />

    <div className="border-t border-border/50 pt-6">
      <CheckoutButton
        loading={loading}
        disabled={loading || total <= 0}
        onClick={handleCheckout}
      />
    </div>
  </div>
</aside>
  );
}