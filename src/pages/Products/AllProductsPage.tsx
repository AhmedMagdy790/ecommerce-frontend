import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';


import type { Product, ProductFilters as IProductFilters } from '@/features/product/model/types/product.types';
import type { ProductVariant } from '@/features/product-variants/model/types/productVariant.types';
import type { Category } from '@/features/category/model/types/category.types';
import type { Brand } from '@/features/brand/types/brand.types';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { ProductGrid } from '@/features/products/components/ProductGrid';
// import { useCart } from '../Cart/hook/useCart';

// يمكن استبدال هذه بـ React Query hooks الحقيقية لديك
// import { useProducts } from '../api/useProducts';
// import { useCategories } from '@/features/category/api/useCategories';
// import { useBrands } from '@/features/brand/api/useBrands';

export const AllProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 1. تحويل الـ URL SearchParams إلى كائن Filters
  const filtersFromUrl = useMemo<IProductFilters>(() => {
    return {
      search: searchParams.get('search') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      brand: searchParams.get('brand') || undefined,
      min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
      max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
      sort: (searchParams.get('sort')) || 'created_at',
      order: (searchParams.get('order')) || 'desc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };
  }, [searchParams]);

  // 2. تحديث الـ URL Params عند تغيير الفلاتر
  const handleFiltersChange = (newFilters: IProductFilters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

    // const {
    //   // cartItems,
    //   // isLoading,
    //   addToCart,
    //   // removeFromCart,
    //   // clearCart, // <-- أضفها هنا
    //   // isAdding,
    //   // isRemoving,
    //   // isClearing // <-- أضفها هنا
    // } = useCart();

  // 3. محاكاة بيانات الأقسام والعلامات التجارية والمنتجات (استبدلها بالـ Hooks الخاصة بك)
  const isLoading = false;
  const products: Product<string>[] = []; // نضع هنا نتائج الـ API
  const categories: Category<string>[] = []; 
  const brands: Brand<string>[] = []; 

  const totalPages = 5; // يُقرأ عادة من استجابة الـ API meta.last_page
  const currentPage = filtersFromUrl.page || 1;

  const handleAddToCart = async (product: Product<string>, variant?: ProductVariant<string>) => {
    console.log("product", product)
    console.log("variant", variant)
    //  await addToCart({
    //     product_variant_id: item.variant.id,
    //     quantity: item.quantity - 1
    //   });
  };

  const handleQuickView = (product: Product<string>) => {
    void product;

    // فتح Modal النظرة السريعة
  };

  const handleToggleWishlist = (product: Product<string>) => {
    void product;
    // ربط بالمفضلة
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-[var(--spacing-6)]">
      <div className="container mx-auto px-[var(--spacing-4)]">
        {/* Header & Breadcrumb */}
        <div className="mb-[var(--spacing-6)]">
          <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] lg:text-[var(--text-3xl)]">
            جميع المنتجات
          </h1>
          <p className="mt-1 text-[var(--text-sm)] text-[var(--color-text-muted)]">
            استعرض أفضل المنتجات والخصومات الحصرية
          </p>
        </div>

        {/* Control Bar: Mobile Filter Button & Sorting */}
        <div className="mb-[var(--spacing-6)] flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--card-bg)] p-[var(--spacing-3)] shadow-[var(--shadow-xs)]">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-primary)] lg:hidden"
          >
            <Filter className="h-4 w-4 text-[var(--color-primary)]" />
            <span>الفلاتر</span>
          </button>

          <div className="hidden lg:block text-[var(--text-xs)] text-[var(--color-text-muted)]">
            إجمالي المنتجات: <span className="font-[var(--font-semibold)] text-[var(--color-text-primary)]">{products.length}</span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[var(--color-text-muted)]" />
            <select
              value={`${filtersFromUrl.sort}-${filtersFromUrl.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                handleFiltersChange({
                  ...filtersFromUrl,
                  sort: sort,
                  order: order,
                  page: 1,
                });
              }}
              className="rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] py-1.5 pr-2 pl-8 text-[var(--text-sm)] text-[var(--color-text-primary)] focus:border-[var(--input-focus)] focus:outline-none"
            >
              <option value="created_at-desc">الأحدث أولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="rating-desc">الأعلى تقييماً</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex items-start gap-[var(--spacing-6)]">
          {/* Sidebar Filter */}
          <ProductFilters
            filters={filtersFromUrl}
            onChange={handleFiltersChange}
            onReset={handleResetFilters}
            categories={categories}
            brands={brands}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Products Grid Area */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-[var(--spacing-8)] flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handleFiltersChange({ ...filtersFromUrl, page: currentPage - 1 })}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handleFiltersChange({ ...filtersFromUrl, page })}
                    className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-sm)] font-[var(--font-medium)] transition-colors ${
                      currentPage === page
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handleFiltersChange({ ...filtersFromUrl, page: currentPage + 1 })}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};