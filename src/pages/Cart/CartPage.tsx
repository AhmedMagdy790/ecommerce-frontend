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
import { Container } from "@/shared/components/layout/Container";

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
    isClearing,
  } = useCart();

  const { subtotal, shipping, tax, total, discount } = useCartCalculations(cartItems || []);

  // Handlers المدعومة بالتحديث الفوري عبر الـ Hook
  const handleIncrease = async (cartItemId: number | string) => {
    const item = cartItems.find((i: ICartItem) => i.id === cartItemId);
    if (item && item.variant) {
      await addToCart({
        product_variant_id: Number(item.variant.id),
        quantity: item.quantity + 1,
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
        product_variant_id: Number(item.variant.id),
        quantity: item.quantity - 1,
      });
    }
  };

  const handleRemove = async (cartItemId: number | string) => {
    await removeFromCart(cartItemId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} strokeWidth={2} />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full min-h-[85vh] bg-background text-text-primary py-12 transition-colors duration-[var(--duration-normal)]"
    >
      <Container size="2xl">

        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border mb-10 pb-6 gap-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-card bg-surface-secondary border border-border text-primary">
                <ShoppingBag size={18} strokeWidth={2.2} />
              </span>
              <span 
                className="text-xs font-semibold text-primary uppercase tracking-wider" 
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                {t("badge", { defaultValue: lang === "ar" ? "مشترياتك الحالية" : "Your Shopping Session" })}
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary" 
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("title", { defaultValue: lang === "ar" ? "سلة المشتريات" : "Shopping Cart" })}
            </h1>

            <p 
              className="text-sm text-text-secondary font-medium" 
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("itemsCount", { count: cartItems.length, defaultValue: lang === "ar" ? `لديك ${cartItems.length} عناصر في حقيبتك.` : `You have ${cartItems.length} items in your bag.` })}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearCart}
              disabled={isClearing || isLoading}
              className="inline-flex items-center h-10 px-4 rounded-card bg-surface-secondary border border-border text-red-600 dark:text-red-400 text-sm font-bold gap-2 transition-all duration-200 hover:opacity-80 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-xs"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {isClearing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} strokeWidth={2} />}
              <span>{t("clearCart", { defaultValue: lang === "ar" ? "إفراغ السلة" : "Clear Cart" })}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Responsive Layout Grid */}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
          {/* Cart Items List */}
          <section className="w-full relative">
            {(isAdding || isRemoving || isClearing) && (
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 z-10 rounded-panel transition-all backdrop-blur-[1px]" />
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
              currency="EGP"
              loading={isLoading || isAdding || isRemoving}
            />
          </aside>
        </div>

      </Container>
    </main>
  );
}