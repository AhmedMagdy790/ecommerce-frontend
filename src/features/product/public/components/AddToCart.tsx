// src/pages/ProductDetails/components/AddToCart.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Check } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface AddToCartProps {
  productId: string;
  stock?: boolean;
  maxStock?: number;

  variants?: {
    size?: string;
    color?: string;
  };

  onAddToCart: (payload: {
    productId: string;
    quantity: number;
    variants?: {
      size?: string;
      color?: string;
    };
  }) => void;
}

export default function AddToCart({
  productId,
  stock = true,
  maxStock = 0,
  variants,
  onAddToCart,
}: AddToCartProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const isMaxStock = quantity < maxStock;

  function handleAddToCart() {
    onAddToCart({
      productId,
      quantity,
      variants,
    });

    // Trigger temporary success state animation
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  }

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-[var(--spacing-8)] flex flex-col gap-[var(--spacing-6)] w-full"
    >
      {/* Quantity Selector and Stock Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-4)]">
        
        {/* Counter Widget */}
        <div className="flex items-center gap-[var(--spacing-3)]">
          <span 
            className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-text-secondary)] uppercase tracking-wider"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {lang === "ar" ? "الكمية:" : "Quantity:"}
          </span>

          <div className="inline-flex items-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={!stock || quantity <= 1}
              aria-label="Decrease quantity"
              className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-surface-secondary)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              -
            </button>

            <span className="min-w-10 text-center text-[var(--text-sm)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              disabled={!stock || !isMaxStock}
              aria-label="Increase quantity"
              className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-surface-secondary)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              +
            </button>
          </div>
        </div>

        {/* Live Stock Indicator Badge */}
        <div className="flex items-center gap-[var(--spacing-2)]">
          <span className={`w-2.5 h-2.5 rounded-full ${stock ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
          <span 
            className={`text-[var(--text-xs)] font-[var(--font-semibold)] ${stock ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {stock 
              ? (lang === "ar" ? "متوفر في المخزون" : "In Stock") 
              : (lang === "ar" ? "نفد من المخزون" : "Out of Stock")}
          </span>
        </div>

      </div>

      {/* Main Add to Cart Action Button */}
      <button
        type="button"
        disabled={!stock}
        onClick={handleAddToCart}
        className={`w-full inline-flex items-center justify-center gap-[var(--spacing-3)] rounded-[var(--radius-2xl)] py-[var(--spacing-4)] px-[var(--spacing-8)] text-[var(--text-base)] font-[var(--font-semibold)] shadow-xl transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] ${
          isAdded 
            ? "bg-emerald-600 text-white scale-[1.02]" 
            : "bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:opacity-90 hover:scale-[1.01] active:scale-95"
        } disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100`}
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {isAdded ? (
          <>
            <Check size={20} strokeWidth={2.5} className="animate-bounce" />
            <span>{lang === "ar" ? "تمت الإضافة بنجاح!" : "Added to Cart!"}</span>
          </>
        ) : (
          <>
            <ShoppingBag size={20} strokeWidth={2.2} />
            <span>
              {stock
                ? t("addToCart", { defaultValue: lang === "ar" ? "أضف إلى السلة" : "Add to Cart" })
                : t("outOfStock", { defaultValue: lang === "ar" ? "غير متوفر حالياً" : "Out of Stock" })}
            </span>
          </>
        )}
      </button>

    </div>
  );
}