// src/components/cart/CartSummary.tsx

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { Receipt, ShieldCheck, Truck } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

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
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();

  const handleCheckout = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  return (
    <aside
      dir={isRTL ? "rtl" : "ltr"}
      aria-labelledby="cart-summary-title"
      className="sticky top-[calc(var(--topbar-height,40px)+var(--navbar-height,70px)+var(--spacing-6))] transition-all duration-[var(--duration-normal)] rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--spacing-6)] sm:p-[var(--spacing-8)] shadow-[var(--shadow-xl)] backdrop-blur-xl group"
    >
      {/* Title with Modern Icon */}
      <div className="flex items-center gap-[var(--spacing-3)] border-b border-[var(--color-border)] pb-[var(--spacing-4)] mb-[var(--spacing-6)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-primary)] shadow-xs">
          <Receipt size={18} strokeWidth={2.2} />
        </span>
        <h2
          id="cart-summary-title"
          className="text-[var(--text-xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)]"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("summary.title", { defaultValue: "Order Summary" })}
        </h2>
      </div>

      <div className="flex flex-col gap-[var(--spacing-6)]">
        <CartTotals
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          discount={discount}
          total={total}
          currency={currency}
        />

        {/* Secure Checkout Perks Note */}
        <div className="flex flex-col gap-[var(--spacing-3)] p-[var(--spacing-4)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] shadow-inner">
          <div className="flex items-center gap-[var(--spacing-2.5)]">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={14} />
            </div>
            <span
              className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-text-primary)]"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {lang === "ar" ? "دفع آمن ومحمي 100%" : "100% Secure & Protected Checkout"}
            </span>
          </div>

          <div className="flex items-center gap-[var(--spacing-2.5)]">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Truck size={14} />
            </div>
            <span
              className="text-[var(--text-xs)] font-[var(--font-medium)] text-[var(--color-text-secondary)]"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {lang === "ar" ? "شحن سريع وموثوق لجميع الطلبات" : "Fast & Reliable shipping on all orders"}
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-[var(--spacing-2)]">
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