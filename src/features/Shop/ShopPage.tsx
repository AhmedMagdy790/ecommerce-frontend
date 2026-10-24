// src/pages/ShopPage.tsx

import React, { useState } from 'react';
import { Filter, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ProductFilters } from '@/features/products/components/ProductFilters';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { QuickViewModal } from '@/features/products/components/QuickViewModal';
import { FeaturedSection } from '@/features/products/components/FeaturedSection';
import { DebouncedSearchInput } from '@/shared/components/DebouncedSearchInput';
import { useUrlState } from '@/shared/hooks/useUrlState';

import type { Product, ProductFilters as IProductFilters } from '@/features/product/model/types/product.types';
import type { ProductVariant } from '@/features/product-variants/model/types/productVariant.types';
import type { Brand } from '@/features/brand/types/brand.types';
import { useCartStore } from '../cart/model/store/cart.store';
import { useProducts } from '../products/hooks/useProducts';
import { useCategories } from '../category/api/useCategories';
import { useLang } from '@/shared/context/LanguageContext';

const DEFAULT_FILTERS: IProductFilters = {
  category_id: undefined,
  brand: undefined,
  min_price: undefined,
  max_price: undefined,
  sort: 'created_at',
  search: '',
  order: 'desc',
  page: 1,
  limit: 12,
};

export const ShopPage: React.FC = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product<string> | null>(null);

  const { t } = useTranslation('shop');
  const { isRTL } = useLang();
  const addToCart = useCartStore((state) => state.addToCart);

  // 1. إدارة الـ URL State
  const [filters, setFilters] = useUrlState<IProductFilters>(DEFAULT_FILTERS);

  // 2. جلب البيانات بناءً على الفلاتر من الـ URL
  const { data, isLoading } = useProducts(filters);
  const { data: categories = [] } = useCategories();

  const products = data?.items || [];
  const totalPages = data?.pagination?.last_page || 1;
  const totalProducts = data?.pagination?.total || 0;

  const featuredProducts: Product<string>[] = [];
  const brands: Brand<string>[] = [];

  const handleAddToCart = async (
    _product: Product<string>,
    variant?: ProductVariant<string>,
    quantity = 1
  ) => {
    const targetVariantId = variant?.id;
    if (!targetVariantId) return;

    try {
      await addToCart({ product_variant_id: targetVariantId, quantity });
    } catch (error) {
      console.error(t('errors.addToCart', 'حدث خطأ أثناء إضافة المنتج للسلة:'), error);
    }
  };

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-[var(--spacing-12)]">
      {featuredProducts.length > 0 && (
        <FeaturedSection
          products={featuredProducts}
          onAddToCart={handleAddToCart}
          onQuickView={setQuickViewProduct}
          onToggleWishlist={() => {}}
        />
      )}

      <div className="container mx-auto px-[var(--spacing-4)] pt-[var(--spacing-6)]">
        <div className="mb-[var(--spacing-6)] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] lg:text-[var(--text-3xl)]">
              {t('title', 'متجر المنتجات')}
            </h1>
            <p className="mt-1 text-[var(--text-sm)] text-[var(--color-text-muted)]">
              {t(
                'subtitle',
                'تصفح تشكيلتنا الشاملة واستخدم الفلاتر للحصول على المنتج المناسب لك'
              )}
            </p>
          </div>

          {/* مكون البحث المزدوج والمنظم */}
          <DebouncedSearchInput
            value={filters.search}
            onChange={(searchValue) => setFilters({ search: searchValue })}
            placeholder={t('searchPlaceholder', 'ابحث عن منتج...')}
            className="w-full max-w-xs"
          />
        </div>

        <div className="mb-[var(--spacing-6)] flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--card-bg)] p-[var(--spacing-3)] shadow-[var(--shadow-xs)]">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-primary)] lg:hidden"
          >
            <Filter className="h-4 w-4 text-[var(--color-primary)]" />
            <span>{t('filtersButton', 'الفلاتر')}</span>
          </button>

          <div className="hidden lg:block text-[var(--text-xs)] text-[var(--color-text-muted)]">
            {t('showingProducts', 'المنتجات المعروضة:')}{' '}
            <span className="font-[var(--font-semibold)] text-[var(--color-text-primary)]">
              {t('productsCount', '{{count}} من أصل {{total}}', {
                count: products.length,
                total: totalProducts,
              })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-[var(--spacing-6)]">
          <ProductFilters
            filters={filters}
            onChange={(newFilters) => setFilters(newFilters)}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            categories={categories}
            brands={brands}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          <div className="flex-1">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
              onQuickView={setQuickViewProduct}
              onToggleWishlist={() => {}}
            />

            {!isLoading && totalPages > 1 && (
              <div className="mt-[var(--spacing-8)] flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={(filters.page ?? 1) <= 1}
                  onClick={() =>
                    setFilters({ page: (filters.page ?? 1) - 1 }, { resetPage: false })
                  }
                  aria-label={t('pagination.previous', 'الصفحة السابقة')}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)] disabled:opacity-40"
                >
                  <PrevIcon className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setFilters({ page }, { resetPage: false })}
                    className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-sm)] font-[var(--font-medium)] transition-colors ${
                      filters.page === page
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={(filters.page ?? 1) >= totalPages}
                  onClick={() =>
                    setFilters({ page: (filters.page ?? 1) + 1 }, { resetPage: false })
                  }
                  aria-label={t('pagination.next', 'الصفحة التالية')}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)] disabled:opacity-40"
                >
                  <NextIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={() => {}}
      />
    </div>
  );
};

export default ShopPage;