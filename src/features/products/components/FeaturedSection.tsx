import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@/features/product/model/types/product.types';
import type { ProductVariant } from '@/features/product-variants/model/types/productVariant.types';

interface FeaturedSectionProps {
  products?: Product<string>[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  onAddToCart?: (product: Product<string>, variant?: ProductVariant<string>) => void;
  onQuickView?: (product: Product<string>) => void;
  onToggleWishlist?: (product: Product<string>) => void;
  wishlistIds?: (number | string)[];
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products = [],
  isLoading = false,
  title = 'منتجات مختارة لك',
  subtitle = 'تسوق أحدث المنتجات المميزة والأكثر طلبًا هذا الأسبوع',
  viewAllLink = '/products?is_featured=true',
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistIds = [],
}) => {
  return (
    <section className="py-[var(--spacing-8)] lg:py-[var(--spacing-12)]">
      <div className="container mx-auto px-[var(--spacing-4)]">
        {/* Section Header */}
        <div className="mb-[var(--spacing-6)] flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)]">
              <Sparkles className="h-4 w-4" />
              <span>مختارات خاصة</span>
            </div>
            <h2 className="text-[var(--text-xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] sm:text-[var(--text-2xl)]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-[var(--text-sm)] text-[var(--color-text-muted)]">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="group flex items-center gap-1.5 text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-primary)] transition-colors hover:text-[var(--button-bg-hover)]"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-1" />
            </Link>
          )}
        </div>

        {/* Featured Products Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          skeletonCount={4}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
          onToggleWishlist={onToggleWishlist}
          wishlistIds={wishlistIds}
          emptyTitle="لا توجد منتجات مميزة حالياً"
          emptyDescription="تابعنا قريباً لإضافة تشكيلة جديدة من المنتجات المميزة."
        />
      </div>
    </section>
  );
};