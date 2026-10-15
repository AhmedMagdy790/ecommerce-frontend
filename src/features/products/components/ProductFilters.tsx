import React, { useState, useEffect, useRef } from 'react';
import { Filter, X, Search, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { Category } from '@/features/category/model/types/category.types';
import type { Brand } from '@/features/brand/types/brand.types';
import type { ProductFilters as IProductFilters } from '@/features/product/model/types/product.types';

interface ProductFiltersProps {
  filters: IProductFilters;
  onChange: (filters: IProductFilters) => void;
  onReset: () => void;
  categories?: Category<string>[];
  brands?: Brand<string>[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  categories = [],
  brands = [],
  isMobileOpen = false,
  onCloseMobile,
}) => {
  // Local state for inputs
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [minPrice, setMinPrice] = useState<string>(filters.min_price?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.max_price?.toString() || '');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. المزامنة الخارجية تحدث **فقط** إذا لم يكن المستخدم يكتب داخل الحقل حالياً (ليس Active)
  // useEffect(() => {
  //   if (document.activeElement !== searchInputRef.current) {
  //     setLocalSearch(filters.search || '');
  //   }
  // }, [filters.search]);

  // const [priceFilterValues, setPriceFilterValues] = useState({
  //   min: filters.min_price,
  //   max: filters.max_price,
  // });

  // const displayedMinPrice =
  //   priceFilterValues.min === filters.min_price
  //     ? minPrice
  //     : filters.min_price?.toString() || '';
  // const displayedMaxPrice =
  //   priceFilterValues.max === filters.max_price
  //     ? maxPrice
  //     : filters.max_price?.toString() || '';

  // 2. Debounced search effect (إرسال البحث بدون إعادة كتابة الـ Input)
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = localSearch.trim();
      const currentFilterSearch = filters.search || '';
      
      if (trimmed !== currentFilterSearch) {
        onChange({ ...filters, search: trimmed || undefined, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  // Collapse Accordion states
  const [openSections, setOpenSections] = useState({
    search: true,
    category: true,
    price: true,
    brand: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = localSearch.trim();
    onChange({ ...filters, search: trimmed, page: 1 });
  };

  const handlePriceApply = () => {
    onChange({
      ...filters,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      page: 1,
    });
  };

  const handleCategorySelect = (categoryId?: number | string) => {
    const nextCategory = filters.category_id === categoryId ? undefined : categoryId;
    onChange({ ...filters, category_id: nextCategory, page: 1 });
  };

  const handleBrandSelect = (brandId: number | string) => {
    const nextBrand = filters.brand === brandId || filters.brand_id === brandId ? undefined : brandId;
    onChange({ ...filters, brand_id: nextBrand, page: 1 });
  };

  const handleResetAll = () => {
    setLocalSearch('');
    setMinPrice('');
    setMaxPrice('');
    onReset();
  };

  const FilterContent = (
    <div className="flex flex-col gap-[var(--spacing-6)] p-[var(--spacing-4)] lg:p-0">
      {/* Filter Header & Reset Button */}
      <div className="flex items-center justify-between pb-[var(--spacing-3)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-[var(--font-bold)] text-[var(--text-base)]">
          <Filter className="h-5 w-5 text-[var(--color-primary)]" />
          <span>الفلاتر</span>
        </div>
        <button
          type="button"
          onClick={handleResetAll}
          className="flex items-center gap-1 text-[var(--text-xs)] font-[var(--font-medium)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-error)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>إعادة ضبط</span>
        </button>
      </div>

      {/* 1. Search Box */}
      <div className="border-b border-[var(--color-border)] pb-[var(--spacing-4)]">
        <button
          type="button"
          onClick={() => toggleSection('search')}
          className="flex w-full items-center justify-between py-1 text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]"
        >
          <span>البحث</span>
          {openSections.search ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {openSections.search && (
          <form onSubmit={handleSearchSubmit} className="mt-[var(--spacing-3)] relative">
            <input
              ref={searchInputRef}
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] py-2 pr-3 pl-9 text-[var(--text-sm)] text-[var(--color-text-primary)] transition-colors focus:border-[var(--input-focus)] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>

      {/* 2. Categories */}
      {categories.length > 0 && (
        <div className="border-b border-[var(--color-border)] pb-[var(--spacing-4)]">
          <button
            type="button"
            onClick={() => toggleSection('category')}
            className="flex w-full items-center justify-between py-1 text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]"
          >
            <span>الأقسام</span>
            {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {openSections.category && (
            <div className="mt-[var(--spacing-3)] flex flex-col gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
              {categories.map((cat) => {
                const isSelected = String(filters.category_id) === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex items-center justify-between rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[var(--text-sm)] transition-colors text-right ${
                      isSelected
                        ? 'bg-[var(--violet-50)] dark:bg-[var(--violet-900)]/30 text-[var(--color-primary)] font-[var(--font-semibold)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Price Filter */}
      <div className="border-b border-[var(--color-border)] pb-[var(--spacing-4)]">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between py-1 text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]"
        >
          <span>السعر (ج.م)</span>
          {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {openSections.price && (
          <div className="mt-[var(--spacing-3)] space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="من"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-2.5 py-1.5 text-[var(--text-sm)] text-[var(--color-text-primary)] focus:border-[var(--input-focus)] focus:outline-none"
              />
              <span className="text-[var(--color-text-muted)]">-</span>
              <input
                type="number"
                placeholder="إلى"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-2.5 py-1.5 text-[var(--text-sm)] text-[var(--color-text-primary)] focus:border-[var(--input-focus)] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handlePriceApply}
              className="w-full rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)] py-1.5 text-[var(--text-xs)] font-[var(--font-medium)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
            >
              تطبيق السعر
            </button>
          </div>
        )}
      </div>

      {/* 4. Brands */}
      {brands.length > 0 && (
        <div className="pb-[var(--spacing-4)]">
          <button
            type="button"
            onClick={() => toggleSection('brand')}
            className="flex w-full items-center justify-between py-1 text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]"
          >
            <span>العلامات التجارية</span>
            {openSections.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {openSections.brand && (
            <div className="mt-[var(--spacing-3)] flex flex-col gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
              {brands.map((brand) => {
                const brandName = brand.name;
                const isSelected = String(filters.brand) === String(brand.id) || String(filters.brand_id) === String(brand.id);
                return (
                  <label
                    key={brand.id}
                    className="flex items-center gap-2.5 cursor-pointer py-1 px-1 rounded hover:bg-[var(--color-surface)] text-[var(--text-sm)] text-[var(--color-text-secondary)]"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandSelect(brand.id)}
                      className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span>{brandName}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-[var(--sidebar-width)] shrink-0">
        <div className="sticky top-[calc(var(--header-height)+var(--spacing-4))] rounded-[var(--radius-lg)] border border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] p-[var(--spacing-4)] shadow-[var(--shadow-sm)]">
          {FilterContent}
        </div>
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-[var(--z-modal)] lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 right-0 z-[var(--z-modal)] w-full max-w-xs bg-[var(--color-background)] shadow-[var(--shadow-xl)] flex flex-col justify-between overflow-y-auto">
            <div className="p-2 flex justify-end">
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1">{FilterContent}</div>
          </div>
        </div>
      )}
    </>
  );
};