// src/features/cart/components/CartDrawer.tsx

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '@/pages/Cart/hook/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    cartItems: items,
    totalItems,
    isLoading,
    addToCart,
    removeFromCart,
    isAdding,
    isRemoving,
    isClearing,
  } = useCart();

  // إغلاق السلة عند الضغط على Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // تعطيل السكرول في الخلفية عند فتح السلة
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // حساب المجموع الفرعي محلياً من الـ items
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.variant?.price ?? item.product?.price ?? 0);
    return sum + price * Number(item.quantity || 1);
  }, 0);

  const handleUpdateQuantity = async (variantId: number | string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    await addToCart({
      product_variant_id: variantId,
      quantity: newQuantity,
    });
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal,1300)] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-[var(--card-bg,var(--color-surface))] text-[var(--color-text-primary)] shadow-[var(--shadow-xl)] flex flex-col justify-between animate-in slide-in-from-left duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[var(--color-primary)]" />
              <h2 className="text-base font-bold text-text-primary">
                سلة التسوق
              </h2>
              <span className="rounded-full bg-[var(--color-surface-secondary)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
                {totalItems} {totalItems === 1 ? 'عنصر' : 'عناصر'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
            {(isLoading || isAdding || isRemoving || isClearing) && (
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  سلتك فارغة حالياً
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  قم بزيارة المتجر واستمتع بخصومات المنتجات المتاحة.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/shop');
                  }}
                  className="mt-6 rounded-md bg-[var(--color-primary)] px-5 py-2 text-xs font-medium text-white hover:opacity-90 transition-colors"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const product = item.product;
                  const variant = item.variant;
                  const itemPrice = Number(variant?.price ?? product?.price ?? 0);
                  const itemImage =
                    product?.image || product?.thumbnail || '/images/placeholders/product.webp';

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-3 transition-all hover:border-[var(--color-primary)]/40"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={itemImage}
                        alt={product?.name || 'صورة المنتج'}
                        className="h-20 w-20 shrink-0 rounded-md bg-surface object-cover"
                      />

                      {/* Content & Actions */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="line-clamp-1 text-sm font-semibold text-[var(--color-text-primary)]">
                              {product?.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                              title="حذف من السلة"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {variant?.sku && (
                            <span className="mt-0.5 inline-block text-xs text-[var(--color-text-muted)]">
                              SKU: {variant.sku}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center rounded-md border border-[var(--color-border)] bg-surface">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(variant?.id ?? item.product_variant_id, item.quantity - 1)
                              }
                              className="px-2 py-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(variant?.id ?? item.product_variant_id, item.quantity + 1)
                              }
                              className="px-2 py-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-sm font-bold text-[var(--color-primary)]">
                            {(itemPrice * item.quantity).toLocaleString()} ج.م
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="border-t border-[var(--color-border)] p-4 bg-[var(--card-bg)]">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-[var(--color-text-muted)]">المجموع الفرعي:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {subtotal.toLocaleString()} ج.م
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  تُحسب الضرائب ومصاريف الشحن عند إتمام الطلب.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] py-3 text-sm font-bold text-white hover:opacity-90 transition-colors active:scale-98 disabled:opacity-50 shadow-xs"
                >
                  <span>متابعة الشراء</span>
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block text-center text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors py-1"
                >
                  عرض تفاصيل السلة
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};