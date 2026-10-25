// src/features/checkout/components/CheckoutSummary.tsx

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Tag, Truck, Receipt, Loader2 } from "lucide-react";
import { useCart } from "@/pages/Cart/hook/useCart";
import { useCartCalculations } from "@/hooks/useCartCalculations";
import { useSettings } from "@/hooks/useSettings";
import { formatCurrency } from "@/shared/utils/currency";
import { useShippingCalculation } from "../hooks/useShippingCalculation";
import CheckoutSummarySkeleton from "./CheckoutSummarySkeleton";
import { useLang } from "@/shared/context/LanguageContext";

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
  const { isRTL, lang } = useLang();
  const { watch } = useFormContext();

  const shippingCost = watch("shipping_cost") || 0;
  const paymentFee = watch("payment_fee") || 0;

  const { calculatingShipping } = useShippingCalculation();
  
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
    <section 
      dir={isRTL ? "rtl" : "ltr"} 
      className="relative rounded-panel border border-border bg-surface p-6 space-y-6 shadow-xs"
    >
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h2 
          className="text-lg font-bold text-text-primary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("summary.title", { defaultValue: lang === "ar" ? "ملخص الطلب" : "Order Summary" })}
        </h2>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pe-1">
        {isCartLoading ? (
          <CheckoutSummarySkeleton />
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
                      className="h-12 w-12 rounded-card object-cover border border-border shrink-0 bg-surface-secondary"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-card bg-surface-secondary border border-border flex items-center justify-center text-xs text-text-muted shrink-0 font-medium">
                      IMG
                    </div>
                  )}
                  <div className="min-w-0">
                    <p 
                      className="font-semibold text-text-primary truncate"
                      style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                    >
                      {name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {t("summary.quantity", { count: quantity, defaultValue: lang === "ar" ? `الكمية: ${quantity}` : `Qty: ${quantity}` })}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-text-primary shrink-0">
                  {formatCurrency(price * quantity, currencySymbol)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-text-secondary text-center py-4">
            {t("summary.emptyCart", { defaultValue: lang === "ar" ? "سلة التسوق فارغة" : "Your cart is empty" })}
          </p>
        )}
      </div>

      {/* Promo Code Input */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag size={16} className={`absolute top-3 text-text-muted ${isRTL ? "right-3" : "left-3"}`} />
            <input
              type="text"
              placeholder={t("summary.promoPlaceholder", { defaultValue: lang === "ar" ? "رمز الخصم" : "Promo code" })}
              className={`w-full rounded-card border border-border bg-surface-secondary py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${isRTL ? "pr-9 pl-4" : "pl-9 pr-4"}`}
            />
          </div>
          <button
            type="button"
            className="rounded-card bg-surface-secondary border border-border px-4 py-2 text-xs font-semibold text-text-primary hover:bg-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("summary.apply", { defaultValue: lang === "ar" ? "تطبيق" : "Apply" })}
          </button>
        </div>
      </div>

      {/* Cost Calculations */}
      <div className="border-t border-border pt-4 space-y-2.5 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between text-text-secondary">
          <span>{t("summary.subtotal", { defaultValue: lang === "ar" ? "المجموع الفرعي" : "Subtotal" })}</span>
          <span className="font-semibold text-text-primary">
            {formatCurrency(subtotal, currencySymbol)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Truck size={14} />
            {t("summary.shipping", { defaultValue: lang === "ar" ? "الشحن" : "Shipping" })}
          </span>
          <span className="font-semibold text-text-primary flex items-center gap-1">
            {calculatingShipping ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : shipping > 0 ? (
              formatCurrency(shipping, currencySymbol)
            ) : (
              t("summary.calculatedAtNext", { defaultValue: lang === "ar" ? "يُحسب لاحقاً" : "Calculated" })
            )}
          </span>
        </div>

        {/* Tax */}
        {tax > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span>{t("summary.tax", { defaultValue: lang === "ar" ? "الضريبة" : "Tax" })}</span>
            <span className="font-semibold text-text-primary">
              {formatCurrency(tax, currencySymbol)}
            </span>
          </div>
        )}

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>{t("summary.discount", { defaultValue: lang === "ar" ? "الخصم" : "Discount" })}</span>
            <span className="font-semibold">
              -{formatCurrency(discount, currencySymbol)}
            </span>
          </div>
        )}

        {/* Payment Fee */}
        {paymentFee > 0 && (
          <div className="flex justify-between text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Receipt size={14} />
              {t("summary.paymentFee", { defaultValue: lang === "ar" ? "رسوم الدفع" : "Payment Fee" })}
            </span>
            <span className="font-semibold text-text-primary">
              {formatCurrency(paymentFee, currencySymbol)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-border pt-3 flex justify-between text-base font-bold text-text-primary">
          <span>{t("summary.total", { defaultValue: lang === "ar" ? "الإجمالي الكلي" : "Total" })}</span>
          <span className="text-primary">
            {formatCurrency(total, currencySymbol)}
          </span>
        </div>
      </div>

      <div className="rounded-card bg-surface-secondary border border-border p-3 flex items-center gap-2.5 text-xs text-text-secondary">
        <Receipt size={16} className="text-primary shrink-0" />
        <span>{t("summary.taxNote", { defaultValue: lang === "ar" ? "يتم حساب الضرائب ورسوم الشحن عند خطوات الدفع." : "Taxes and shipping calculated at checkout steps." })}</span>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center rounded-panel z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </section>
  );
}