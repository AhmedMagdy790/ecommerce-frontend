import React from 'react';
import { PackageSearch } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/features/product/model/types/product.types';
import type { ProductVariant } from '@/features/product-variants/model/types/productVariant.types';

interface ProductGridProps {
  products?: Product<string>[];
  isLoading?: boolean;
  skeletonCount?: number;
  onAddToCart?: (product: Product<string>, variant?: ProductVariant<string>) => void;
  onQuickView?: (product: Product<string>) => void;
  onToggleWishlist?: (product: Product<string>) => void;
  wishlistIds?: (number | string)[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  isLoading = false,
  skeletonCount = 8,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistIds = [],
  emptyTitle = 'لا توجد منتجات',
  emptyDescription = 'لم نجد أي منتجات تطابق خيارات الفلترة الحالية.',
}) => {
  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-[var(--spacing-4)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="aspect-square w-full bg-[var(--color-surface-secondary)]" />

            {/* Content Skeleton */}
            <div className="flex flex-1 flex-col justify-between p-[var(--spacing-4)] space-y-3">
              <div className="space-y-2">
                <div className="h-3 w-1/3 rounded bg-[var(--color-surface-secondary)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--color-surface-secondary)]" />
              </div>

              <div className="flex items-center justify-between pt-[var(--spacing-2)] border-t border-[var(--color-border)]">
                <div className="h-5 w-1/2 rounded bg-[var(--color-surface-secondary)]" />
                <div className="h-8 w-16 rounded bg-[var(--color-surface-secondary)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--card-bg)] p-[var(--spacing-12)] text-center">
        <div className="mb-[var(--spacing-4)] flex h-16 w-16 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-surface)] text-[var(--color-text-muted)]">
          <PackageSearch className="h-8 w-8" />
        </div>
        <h3 className="text-[var(--text-lg)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
          {emptyTitle}
        </h3>
        <p className="mt-[var(--spacing-2)] max-w-sm text-[var(--text-sm)] text-[var(--color-text-muted)]">
          {emptyDescription}
        </p>
      </div>
    );
  }

  // 3. Render Product Grid
  return (
    <div className="grid grid-cols-1 gap-[var(--spacing-4)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const isWishlisted = wishlistIds.includes(product.id);

        return (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={isWishlisted}
          />
        );
      })}
    </div>
  );
};