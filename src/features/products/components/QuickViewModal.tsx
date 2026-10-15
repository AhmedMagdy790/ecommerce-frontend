import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Heart, Star, Check } from 'lucide-react';
import type { Product } from '@/features/product/model/types/product.types';
import type { ProductVariant } from '@/features/product-variants/model/types/productVariant.types';

interface QuickViewModalProps {
  product: Product<string> | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product<string>, variant?: ProductVariant<string>, quantity?: number) => void;
  onToggleWishlist?: (product: Product<string>) => void;
  isWishlisted?: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [selection, setSelection] = useState<{
    product: Product<string> | null;
    variant: ProductVariant<string> | undefined;
    quantity: number;
    imageIndex: number;
  }>({ product, variant: undefined, quantity: 1, imageIndex: 0 });
  const isCurrentProduct = selection.product === product;
  const selectedVariant = isCurrentProduct
    ? selection.variant
    : (Array.isArray(product?.variants) ? product.variants[0] : undefined);
  const quantity = isCurrentProduct ? selection.quantity : 1;
  const activeImageIndex = isCurrentProduct ? selection.imageIndex : 0;
  const updateSelection = (updates: Partial<Omit<typeof selection, 'product'>>) => {
    setSelection((current) => ({
      product,
      variant: current.product === product ? current.variant : (Array.isArray(product?.variants) ? product.variants[0] : undefined),
      quantity: current.product === product ? current.quantity : 1,
      imageIndex: current.product === product ? current.imageIndex : 0,
      ...updates,
    }));
  };

  // الإغلاق عند ضغط زر Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // 1. تجميع الصور المتاحة
  const imagesList: string[] = [];
  
  if (product.image) imagesList.push(product.image);
  if (product.thumbnail && !imagesList.includes(product.thumbnail)) imagesList.push(product.thumbnail);
  
  if (product.media && Array.isArray(product.media)) {
    product.media.forEach((item) => {
      const url =  item.preview_url;
      if (url && !imagesList.includes(url)) imagesList.push(url);
    });
  }

  if (imagesList.length === 0) {
    imagesList.push('/placeholder-product.png');
  }

  const currentImage = imagesList[activeImageIndex] || imagesList[0];

  // 2. الأسعار والخصومات
  const price = selectedVariant?.price ?? product.price ?? product.starting_at ?? 0;
  const oldPrice = product.oldPrice;
  const hasDiscount = Boolean(oldPrice && oldPrice > price);
  const discountPercentage = hasDiscount && oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const productName = product.name;
  const categoryName = product.category?.name || product.brand?.name || 'متجر';
  const variants = Array.isArray(product.variants) ? product.variants : [];

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-[var(--spacing-4)] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-[var(--z-modal)] w-full max-w-3xl overflow-hidden rounded-[var(--radius-xl)] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-xl)] animate-in fade-in zoom-in-95 duration-[var(--duration-fast)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Gallery Section */}
          <div className="flex flex-col justify-between bg-[var(--color-surface)] p-[var(--spacing-4)]">
            <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--card-bg)]">
              <img
                src={currentImage}
                alt={productName}
                className="h-full w-full object-cover object-center"
              />
              {hasDiscount && (
                <span className="absolute top-3 right-3 rounded-[var(--radius-xs)] bg-[var(--color-error)] px-2 py-0.5 text-[var(--text-xs)] font-[var(--font-bold)] text-white shadow-[var(--shadow-xs)]">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {imagesList.length > 1 && (
              <div className="mt-[var(--spacing-3)] flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateSelection({ imageIndex: idx })}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-md)] border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                        : 'border-[var(--color-border)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions Section */}
          <div className="flex flex-col justify-between p-[var(--spacing-6)]">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-muted)]">
                <span>{categoryName}</span>
                {product.rating ? (
                  <div className="flex items-center gap-1 font-[var(--font-medium)] text-[var(--color-text-primary)]">
                    <Star className="h-4 w-4 fill-[var(--amber-500)] text-[var(--amber-500)]" />
                    <span>{Number(product.rating).toFixed(1)}</span>
                    {product.reviewsCount ? (
                      <span>({product.reviewsCount})</span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Product Title */}
              <h2 className="mt-[var(--spacing-2)] text-[var(--text-lg)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
                {productName}
              </h2>

              {/* Price Row */}
              <div className="mt-[var(--spacing-3)] flex items-baseline gap-3">
                <span className="text-[var(--text-xl)] font-[var(--font-bold)] text-[var(--color-primary)]">
                  {price.toLocaleString()} ج.م
                </span>
                {hasDiscount && (
                  <span className="text-[var(--text-sm)] text-[var(--color-text-muted)] line-through">
                    {oldPrice?.toLocaleString()} ج.م
                  </span>
                )}
              </div>

              {/* Variants Selector */}
              {variants.length > 0 && (
                <div className="mt-[var(--spacing-4)] border-t border-[var(--color-border)] pt-[var(--spacing-4)]">
                  <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-text-primary)]">
                    الخيارات المتاحة:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const variantLabel = v.name || v.sku || `خيار #${v.id}`;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => updateSelection({ variant: v })}
                          className={`flex items-center gap-1 rounded-[var(--radius-md)] border px-3 py-1.5 text-[var(--text-xs)] font-[var(--font-medium)] transition-all ${
                            isSelected
                              ? 'border-[var(--color-primary)] bg-[var(--violet-50)] text-[var(--color-primary)] dark:bg-[var(--violet-900)]/30'
                              : 'border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          <span>{variantLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-[var(--spacing-4)] border-t border-[var(--color-border)] pt-[var(--spacing-4)]">
                <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-text-primary)]">
                  الكمية:
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)]">
                    <button
                      type="button"
                      onClick={() => updateSelection({ quantity: Math.max(1, quantity - 1) })}
                      className="px-3 py-1 text-[var(--text-base)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateSelection({ quantity: quantity + 1 })}
                      className="px-3 py-1 text-[var(--text-base)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Full Details Link */}
            <div className="mt-[var(--spacing-6)] space-y-3 pt-[var(--spacing-4)] border-t border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, selectedVariant, quantity);
                      onClose();
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--button-bg)] px-4 py-2.5 text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--button-text)] transition-colors hover:bg-[var(--button-bg-hover)] active:scale-98"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>إضافة للسلة</span>
                  </button>
                )}

                {onToggleWishlist && (
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] transition-colors hover:bg-[var(--color-surface)] ${
                      isWishlisted ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'
                    }`}
                    title="إضافة للمفضلة"
                  >
                    <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                )}
              </div>

              <Link
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="block text-center text-[var(--text-xs)] font-[var(--font-medium)] text-[var(--color-primary)] hover:underline"
              >
                عرض كل التفاصيل والمواصفات الكاملة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};