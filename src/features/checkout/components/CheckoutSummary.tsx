// src/pages/Checkout/CheckoutSummary.tsx

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Tag, Truck, Receipt, Loader2 } from "lucide-react";
import { useCart } from "@/pages/Cart/hook/useCart";
import { useCartCalculations } from "@/hooks/useCartCalculations";
import { useSettings } from "@/hooks/useSettings";
import { formatCurrency } from "@/shared/utils/currency";

interface CheckoutSummaryProps {
  loading?: boolean;
}

interface CheckoutCartItem {
  variant?: {
    name?: string;
    price?: number;
    image_url?: string;
    image?: string;
  };
  product?: {
    name?: string;
    price?: number;
    image_url?: string;
    image?: string;
  };
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

export default function CheckoutSummary({ loading = false }: CheckoutSummaryProps) {
  const { t } = useTranslation("checkout");
  const { watch } = useFormContext();

  const shippingCost = watch("shipping_cost") || 0;
  const paymentFee = watch("payment_fee") || 0;
  
  const { settings } = useSettings();

  const currencySymbol = settings.currency_symbol || settings.currency || "USD";
  const taxRate = Number(settings.tax) || 0;

  const { cartItems, isLoading: isCartLoading } = useCart();

  
  const { subtotal, shipping, tax, discount, total } = useCartCalculations(
    cartItems || [], 
    0,
    Number(shippingCost) || 0,
    taxRate,
    Number(paymentFee) || 0
  );

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
        <ShoppingBag className="h-5 w-5 text-[var(--color-primary)]" />
        <h2 className="text-lg font-semibold">{t("summary.title", "Order Summary")}</h2>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {isCartLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : cartItems && cartItems.length > 0 ? (
          cartItems.map((item: CheckoutCartItem, index: number) => {
            const variant = item.variant || item.product;
            const name = variant?.name || item.name || "Product Item";
            const price = variant?.price || item.price || 0;
            const quantity = item.quantity || 1;
            const imageUrl = variant?.image_url || variant?.image || item.image;

            return (
              <div key={index} className="flex items-center justify-between text-sm gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-12 w-12 rounded-md object-cover border border-[var(--color-border)] shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-xs text-[var(--color-text-secondary)] shrink-0">
                      IMG
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text)] truncate">{name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">Qty: {quantity}</p>
                  </div>
                </div>
                <span className="font-medium text-sm shrink-0">
                  {formatCurrency(price * quantity, currencySymbol)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">
            {t("summary.emptyCart", "Your cart is empty")}
          </p>
        )}
      </div>

      {/* Promo Code Input */}
      <div className="border-t border-[var(--color-border)] pt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag size={16} className="absolute left-3 top-3 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder={t("summary.promoPlaceholder", "Promo code")}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <button
            type="button"
            className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
          >
            {t("summary.apply", "Apply")}
          </button>
        </div>
      </div>

      {/* Cost Calculations */}
      <div className="border-t border-[var(--color-border)] pt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-[var(--color-text-secondary)]">
          <span>{t("summary.subtotal", "Subtotal")}</span>
          <span className="font-medium text-[var(--color-text)]">
            {formatCurrency(subtotal, currencySymbol)}
          </span>
        </div>

        <div className="flex justify-between text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5">
            <Truck size={14} />
            {t("summary.shipping", "Shipping")}
          </span>
          <span className="font-medium text-[var(--color-text)]">
            {shipping > 0 ? formatCurrency(shipping, currencySymbol) : t("summary.calculatedAtNext", "Calculated")}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>{t("summary.tax", "Tax")}</span>
            <span className="font-medium text-[var(--color-text)]">
              {formatCurrency(tax, currencySymbol)}
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-[var(--color-success,rgb(34,197,94))]">
            <span>{t("summary.discount", "Discount")}</span>
            <span className="font-medium">
              -{formatCurrency(discount, currencySymbol)}
            </span>
          </div>
        )}

        {paymentFee > 0 && (
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1.5">
              <Receipt size={14} />
              {t("summary.paymentFee", "Payment Fee")}
            </span>
            <span className="font-medium text-[var(--color-text)]">
              {formatCurrency(paymentFee, currencySymbol)}
            </span>
          </div>
        )}

        <div className="border-t border-[var(--color-border)] pt-3 flex justify-between text-base font-semibold text-[var(--color-text)]">
          <span>{t("summary.total", "Total")}</span>
          <span className="text-[var(--color-primary)]">
            {formatCurrency(total, currencySymbol)}
          </span>
        </div>
      </div>

      <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-3 flex items-center gap-2.5 text-xs text-[var(--color-text-secondary)]">
        <Receipt size={16} className="text-[var(--color-primary)] shrink-0" />
        <span>{t("summary.taxNote", "Taxes and shipping calculated at checkout steps.")}</span>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center rounded-xl z-10">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
        </div>
      )}
    </section>
  );
}