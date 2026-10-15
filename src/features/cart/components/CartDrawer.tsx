import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../model/store/cart.store';


export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getTotalItems,
    isLoading,
  } = useCartStore();

  // إغلاق السلة عند الضغط على Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

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

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 left-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-[var(--card-bg)] text-[var(--color-text-primary)] shadow-[var(--shadow-xl)] flex flex-col justify-between animate-in slide-in-from-left duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-[var(--spacing-4)]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[var(--color-primary)]" />
              <h2 className="text-[var(--text-lg)] font-[var(--font-bold)]">
                سلة التسوق
              </h2>
              <span className="rounded-[var(--radius-full)] bg-[var(--color-surface)] px-2.5 py-0.5 text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)]">
                {totalItems} {totalItems === 1 ? 'عنصر' : 'عناصر'}
              </span>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-[var(--spacing-4)] custom-scrollbar">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-surface)] text-[var(--color-text-muted)]">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-[var(--text-base)] font-[var(--font-semibold)]">
                  سلتك فارغة حالياً
                </h3>
                <p className="mt-1 text-[var(--text-xs)] text-[var(--color-text-muted)]">
                  قم بزيارة المتجر واستمتع بخصومات المنتجات المتاحة.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="mt-6 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2 text-[var(--text-xs)] font-[var(--font-medium)] text-white hover:bg-[var(--button-bg-hover)] transition-colors"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              <div className="space-y-[var(--spacing-4)]">
                {items.map((item) => {
                  const product = item.product;
                  const variant = item.variant;
                  const itemPrice = item.variant?.price ?? item.product?.price ?? 0;
                  const itemImage =
                    product?.image || product?.thumbnail || '/placeholder-product.png';

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--spacing-3)] transition-all hover:border-[var(--color-primary)]/30"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={itemImage}
                        alt={product?.name || 'صورة المنتج'}
                        className="h-20 w-20 shrink-0 rounded-[var(--radius-md)] bg-[var(--card-bg)] object-cover"
                      />

                      {/* Content & Actions */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="line-clamp-1 text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]">
                              {product?.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
                              title="حذف من السلة"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {variant && (
                            <span className="mt-0.5 inline-block text-[var(--text-xs)] text-[var(--color-text-muted)]">
                              {variant.sku}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.product_variant_id, item.quantity - 1)
                              }
                              className="px-2 py-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-[var(--text-xs)] font-[var(--font-semibold)]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.product_variant_id, item.quantity + 1)
                              }
                              className="px-2 py-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-[var(--text-sm)] font-[var(--font-bold)] text-[var(--color-primary)]">
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
            <div className="border-t border-[var(--color-border)] p-[var(--spacing-4)] bg-[var(--card-bg)]">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-[var(--text-sm)] font-[var(--font-medium)]">
                  <span className="text-[var(--color-text-muted)]">المجموع الفرعي:</span>
                  <span className="font-[var(--font-bold)] text-[var(--color-text-primary)]">
                    {subtotal.toLocaleString()} ج.م
                  </span>
                </div>
                <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                  تُحسب الضرائب ومصاريف الشحن عند إتمام الطلب.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--button-bg)] py-3 text-[var(--text-sm)] font-[var(--font-bold)] text-[var(--button-text)] hover:bg-[var(--button-bg-hover)] transition-colors active:scale-98 disabled:opacity-50"
                >
                  <span>متابعة الشراء</span>
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="block text-center text-[var(--text-xs)] font-[var(--font-medium)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors py-1"
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