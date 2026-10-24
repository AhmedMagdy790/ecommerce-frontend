// src/pages/Cart/CartPage.tsx

import { useTranslation } from "react-i18next";
import { ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

import CartList from "@/features/cart/components/CartList";
import CartSummary from "@/features/cart/components/CartSummary";
import EmptyCart from "@/features/cart/components/EmptyCart";
import { useCartCalculations } from "@/hooks/useCartCalculations";
import { useCart } from "./hook/useCart";
import type { ICartItem } from "@/features/cart/model/types/cart.types";


export default function CartPage() {
  const { t } = useTranslation("cart");
  const { lang, isRTL } = useLang();

  const {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    isAdding,
    isRemoving,
    isClearing
  } = useCart();


  const { subtotal, shipping, tax, total, discount } = useCartCalculations(cartItems || []);

  // 3. API-driven Handlers
  const handleIncrease = async (cartItemId: number | string) => {
    const item = cartItems.find((i: ICartItem) => i.id === cartItemId);
    if (item && item.variant) {
      await addToCart({
        product_variant_id: item.variant.id,
        quantity: item.quantity + 1
      });
    }
  };

  const handleDecrease = async (cartItemId: number | string) => {
    const item = cartItems.find((i: ICartItem) => i.id === cartItemId);
    if (item && item.variant) {
      if (item.quantity <= 1) {
        await removeFromCart(cartItemId);
        return;
      }

      await addToCart({
        product_variant_id: item.variant.id,
        quantity: item.quantity - 1
      });
    }
  };

  const handleRemove = async (cartItemId: number | string) => {
    await removeFromCart(cartItemId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  // 4. Handle UI States
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} strokeWidth={2} />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full min-h-[85vh] bg-[var(--color-background)] text-[var(--color-text-primary)] py-[var(--spacing-12)] px-[var(--spacing-4)] sm:px-[var(--spacing-6)] lg:px-[var(--spacing-8)] transition-colors duration-[var(--duration-normal)]"
    >
      <div className="mx-auto max-w-[var(--container-2xl)]">

        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--color-border)] mb-[var(--spacing-10)] pb-[var(--spacing-6)] gap-[var(--spacing-4)]">
          <div className="flex flex-col gap-[var(--spacing-2)]">
            <div className="inline-flex items-center gap-[var(--spacing-2)]">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-primary)]">
                <ShoppingBag size={18} strokeWidth={2.2} />
              </span>
              <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)] uppercase tracking-wider" style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}>
                {lang === "ar" ? "مشترياتك الحالية" : "Your Shopping Session"}
              </span>
            </div>

            <h1 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}>
              {t("title", { defaultValue: "Shopping Cart" })}
            </h1>

            <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]" style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}>
              {t("description", { defaultValue: `You have ${cartItems.length} items in your bag.` })}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-[var(--spacing-3)]">
           <button
              onClick={handleClearCart}
              disabled={isClearing || isLoading} // <-- استخدمنا isClearing هنا بدلاً من isRemoving
              className="inline-flex items-center h-10 px-[var(--spacing-4)] rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-error)] text-[var(--text-sm)] font-[var(--font-medium)] gap-[var(--spacing-2)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] hover:opacity-80 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              style={{ fontFamily: isRTL ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {isClearing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} strokeWidth={2} />}
              <span>{isRTL ? "إفراغ السلة" : "Clear Cart"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Responsive Layout Grid */}
        <div className="grid items-start gap-[var(--spacing-8)] lg:grid-cols-[1fr_400px]">
          {/* Cart Items List */}
          <section className="w-full relative">
           {(isAdding || isRemoving || isClearing) && (
              <div className="absolute inset-0 bg-black/5 z-10 rounded-xl transition-all" />
            )}

            <CartList
              items={cartItems}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          </section>

          {/* Financial Summary Sidebar */}
          <aside className="w-full sticky top-[calc(var(--topbar-height,40px)+var(--navbar-height,70px)+var(--spacing-6))]">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              total={total}
              currency="USD"
              loading={isLoading || isAdding || isRemoving}
            />
          </aside>
        </div>

      </div>
    </main>
  );
}