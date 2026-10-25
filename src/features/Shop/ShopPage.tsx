import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ProductFilters } from '@/features/products/components/ProductFilters';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { QuickViewModal } from '@/features/products/components/QuickViewModal';
import { FeaturedSection } from '@/features/products/components/FeaturedSection';
import { DebouncedSearchInput } from '@/shared/components/DebouncedSearchInput';
import { useUrlState } from '@/shared/hooks/useUrlState';

import type {
  Product,
  ProductFilters as IProductFilters,
} from '@/features/product/model/types/product.types';
import type { ProductVariant } from '@/features/product-variants/model/types/productVariant.types';
import type { Brand } from '@/features/brand/types/brand.types';

import { useProducts } from '../products/hooks/useProducts';
import { useCategories } from '../category/api/useCategories';
import { useLang } from '@/shared/context/LanguageContext';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { useCart } from '@/pages/Cart/hook/useCart';

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
  const [quickViewProduct, setQuickViewProduct] =
    useState<Product<string> | null>(null);

  const { t } = useTranslation('shop');
  const { isRTL } = useLang();

  const { addToCart } = useCart()

  const [filters, setFilters] =
    useUrlState<IProductFilters>(DEFAULT_FILTERS);

  const { data, isLoading } = useProducts(filters);
  const { data: categories = [] } = useCategories();

  const products = data?.items ?? [];
  const totalPages = data?.pagination?.last_page ?? 1;
  const totalProducts = data?.pagination?.total ?? 0;

  const featuredProducts: Product<string>[] = [];
  const brands: Brand<string>[] = [];

  const handleAddToCart = async (
    _product: Product<string>,
    variant?: ProductVariant<string>,
    quantity = 1,
  ) => {
    if (!variant?.id) return;

    try {
      await addToCart({
        product_variant_id: variant.id,
        quantity,
      });
    } catch (error) {
      console.error(
        t('errors.addToCart', 'حدث خطأ أثناء إضافة المنتج للسلة'),
        error,
      );
    }
  };

  const handleResetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <main className="min-h-screen bg-surface pb-12">
      {featuredProducts.length > 0 && (
        <FeaturedSection
          products={featuredProducts}
          onAddToCart={handleAddToCart}
          onQuickView={setQuickViewProduct}
          onToggleWishlist={() => {}}
        />
      )}

      {/* Container الرئيسي مع متغير العرض المتوافق مع الهيكل العام */}
      <Container className="pt-6">
        <Breadcrumbs
          items={[{ label: t('title', 'متجر المنتجات') }]}
          className="mb-4"
        />
                
        <PageHeader
          title={t("title", "متجر المنتجات")}
          description={t(
            "subtitle",
            "تصفح تشكيلتنا الشاملة واستخدم الفلاتر للحصول على المنتج المناسب لك",
          )}
          actions={
            <DebouncedSearchInput
              value={filters.search ?? ""}
              onChange={(searchValue) => {
                setFilters({
                  search: searchValue,
                  page: 1,
                });
              }}
              placeholder={t("searchPlaceholder", "ابحث عن منتج...")}
              className="w-full sm:w-72"
            />
          }
        />


        {/* Filter toolbar and Sidebar integration */}
        <div className="mb-6 flex items-center justify-between gap-3 rounded-panel border border-border bg-surface p-3 shadow-sm">
          {/* ProductFilters مدمج هنا ليظهر زر الفلاتر في الشريط العلوي */}
          <ProductFilters
            filters={filters}
            onChange={(newFilters) => setFilters(newFilters)}
            onReset={handleResetFilters}
            categories={categories}
            brands={brands}
          />

          <div className="text-xs text-text-muted">
            {t('showingProducts', 'المنتجات المعروضة:')}{' '}
            <span className="font-semibold text-text-primary">
              {t('productsCount', '{{count}} من أصل {{total}}', {
                count: products.length,
                total: totalProducts,
              })}
            </span>
          </div>
        </div>

        {/* Products section */}
        <section
          aria-label={t('productsSection', 'المنتجات')}
          className="min-w-0 flex-1"
        >
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            onQuickView={setQuickViewProduct}
            onToggleWishlist={() => {}}
          />

          {!isLoading && totalPages > 1 && (
            <nav
              aria-label={t('pagination.label', 'التنقل بين صفحات المنتجات')}
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                disabled={(filters.page ?? 1) <= 1}
                onClick={() =>
                  setFilters(
                    { page: (filters.page ?? 1) - 1 },
                    { resetPage: false },
                  )
                }
                aria-label={t('pagination.previous', 'الصفحة السابقة')}
                className="flex h-9 w-9 items-center justify-center rounded-control border border-border bg-surface text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PrevIcon aria-hidden="true" className="h-4 w-4" />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              ).map((page) => {
                const isCurrentPage = (filters.page ?? 1) === page;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setFilters({ page }, { resetPage: false })
                    }
                    aria-label={t('pagination.goToPage', {
                      page,
                      defaultValue: `الانتقال إلى الصفحة ${page}`,
                    })}
                    aria-current={isCurrentPage ? 'page' : undefined}
                    className={`flex h-9 w-9 items-center justify-center rounded-control text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isCurrentPage
                        ? 'bg-primary text-text-inverse'
                        : 'border border-border bg-surface text-text-primary hover:bg-surface-hover'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={(filters.page ?? 1) >= totalPages}
                onClick={() =>
                  setFilters(
                    { page: (filters.page ?? 1) + 1 },
                    { resetPage: false },
                  )
                }
                aria-label={t('pagination.next', 'الصفحة التالية')}
                className="flex h-9 w-9 items-center justify-center rounded-control border border-border bg-surface text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <NextIcon aria-hidden="true" className="h-4 w-4" />
              </button>
            </nav>
          )}
        </section>
      </Container>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={() => {}}
      />
    </main>
  );
};

export default ShopPage;