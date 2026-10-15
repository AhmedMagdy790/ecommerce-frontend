import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Star } from 'lucide-react';
import type { Product } from '@/features/product/model/types/product.types';
import type { ProductVariant } from '@/features/product-variants/model/types/productVariant.types';

interface ProductCardProps {
  product: Product<string>;
  onAddToCart?: (product: Product<string>, variant?: ProductVariant<string>) => void;
  onQuickView?: (product: Product<string>) => void;
  onToggleWishlist?: (product: Product<string>) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false,
}) => {

  const mainImage =
    product.image;

  // 2. استخراج المتغير الأساسي والأسعار
  const primaryVariant: ProductVariant<string> | undefined = Array.isArray(product.variants)
    ? product.variants[0]
    : undefined;

  const price = product.price ?? primaryVariant?.price ?? product.starting_at ?? 0;
  const oldPrice = product.oldPrice;
  const hasDiscount = Boolean(oldPrice && oldPrice > price);

  const discountPercentage = hasDiscount && oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  // 3. قراءة الأسماء مباشرة كـ string
  const productName = product.name;
  const categoryName = product.category?.name || product.brand?.name || 'متجر';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
      {/* Image Container & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface)]">
        <img
          src={mainImage}
          alt={productName}
          className="h-full w-full object-cover object-center transition-transform duration-[var(--duration-slow)] ease-[var(--ease-default)] group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5">
            {product.is_featured && (
              <span className="rounded-[var(--radius-xs)] bg-[var(--color-primary)] px-2 py-0.5 text-[var(--text-xs)] font-[var(--font-medium)] text-white shadow-[var(--shadow-xs)]">
                مميز
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-[var(--radius-xs)] bg-[var(--color-error)] px-2 py-0.5 text-[var(--text-xs)] font-[var(--font-bold)] text-white shadow-[var(--shadow-xs)]">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick Action Overlay Buttons */}
          <div className="flex flex-col gap-2 opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100 pointer-events-auto">
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-background)] shadow-[var(--shadow-md)] transition-colors hover:bg-[var(--color-surface)] ${
                  isWishlisted ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]'
                }`}
                title="إضافة للمفضلة"
              >
                <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            )}

            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-background)] text-[var(--color-text-secondary)] shadow-[var(--shadow-md)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                title="نظرة سريعة"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col justify-between p-[var(--spacing-4)]">
        <div>
          {/* Category & Rating Row */}
          <div className="mb-1.5 flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-muted)]">
            <span>{categoryName}</span>
            
            {product.rating ? (
              <div className="flex items-center gap-1 font-[var(--font-medium)] text-[var(--color-text-primary)]">
                <Star className="h-3.5 w-3.5 fill-[var(--amber-500)] text-[var(--amber-500)]" />
                <span>{Number(product.rating).toFixed(1)}</span>
                {product.reviewsCount ? (
                  <span className="text-[var(--color-text-muted)]">({product.reviewsCount})</span>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.slug}`}
            className="line-clamp-2 text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-primary)]"
          >
            {productName}
          </Link>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-[var(--spacing-4)] flex items-center justify-between pt-[var(--spacing-2)] border-t border-[var(--color-border)]">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[var(--text-xs)] text-[var(--color-text-muted)] line-through">
                {oldPrice?.toLocaleString()} ج.م
              </span>
            )}
            <span className="text-[var(--text-base)] font-[var(--font-bold)] text-[var(--color-primary)]">
              {price.toLocaleString()} ج.م
            </span>
          </div>

          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product, primaryVariant)}
              className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--button-bg)] px-3 py-2 text-[var(--text-xs)] font-[var(--font-medium)] text-[var(--button-text)] transition-colors hover:bg-[var(--button-bg-hover)] active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>إضافة</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};