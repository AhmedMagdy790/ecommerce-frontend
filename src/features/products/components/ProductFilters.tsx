import React, { useEffect, useRef, useState } from 'react';
import {
  Filter,
  X,
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { Category } from '@/features/category/model/types/category.types';
import type { Brand } from '@/features/brand/types/brand.types';
import type { ProductFilters as IProductFilters } from '@/features/product/model/types/product.types';
import { useLang } from '@/shared/context/LanguageContext';

interface ProductFiltersProps {
  filters: IProductFilters;
  onChange: (filters: IProductFilters) => void;
  onReset: () => void;
  categories?: Category<string>[];
  brands?: Brand<string>[];
  disabledSearch?: boolean; // خاصية لتعطيل البحث
}

type FilterSection = 'search' | 'category' | 'price' | 'brand';

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  categories = [],
  brands = [],
  disabledSearch = false,
}) => {
  const { t } = useTranslation('productFilters');
  const { isRTL } = useLang();

  // حالة محلية للتحكم في فتح وإغلاق الـ Sidebar عبر الزر
  const [isOpen, setIsOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState(filters.search ?? '');
  const [priceInputs, setPriceInputs] = useState({
    minPrice: filters.min_price?.toString() ?? '',
    maxPrice: filters.max_price?.toString() ?? '',
    minFilter: filters.min_price,
    maxFilter: filters.max_price,
  });

  if (
    priceInputs.minFilter !== filters.min_price ||
    priceInputs.maxFilter !== filters.max_price
  ) {
    setPriceInputs({
      minPrice: filters.min_price?.toString() ?? '',
      maxPrice: filters.max_price?.toString() ?? '',
      minFilter: filters.min_price,
      maxFilter: filters.max_price,
    });
  }

  const { minPrice, maxPrice } = priceInputs;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchFocusedRef = useRef(false);

  const filtersRef = useRef(filters);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    filtersRef.current = filters;
    onChangeRef.current = onChange;
  }, [filters, onChange]);

  const [openSections, setOpenSections] = useState<
    Record<FilterSection, boolean>
  >({
    search: true,
    category: true,
    price: true,
    brand: true,
  });

  const toggleSection = (section: FilterSection) => {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  useEffect(() => {
    if (!isSearchFocusedRef.current) {
      setLocalSearch(filters.search ?? '');
    }
  }, [filters.search]);

  useEffect(() => {
    if (disabledSearch) return;

    const trimmedSearch = localSearch.trim();

    if (trimmedSearch === (filters.search ?? '').trim()) {
      return;
    }

    const timer = window.setTimeout(() => {
      const currentFilters = filtersRef.current;

      if (trimmedSearch === (currentFilters.search ?? '').trim()) {
        return;
      }

      onChangeRef.current({
        ...currentFilters,
        search: trimmedSearch || undefined,
        page: 1,
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [localSearch, filters.search, disabledSearch]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabledSearch) return;

    const search = localSearch.trim();
    const currentFilters = filtersRef.current;

    if (search !== (currentFilters.search ?? '').trim()) {
      onChangeRef.current({
        ...currentFilters,
        search: search || undefined,
        page: 1,
      });
    }
  };

  const handlePriceApply = () => {
    const min = minPrice.trim() ? Number(minPrice) : undefined;
    const max = maxPrice.trim() ? Number(maxPrice) : undefined;

    if (
      (min !== undefined && (!Number.isFinite(min) || min < 0)) ||
      (max !== undefined && (!Number.isFinite(max) || max < 0)) ||
      (min !== undefined && max !== undefined && min > max)
    ) {
      return;
    }

    // استخدام الـ refs لضمان جلب أحدث حالة للفلاتر وتجنب الـ Stale Closures
    const currentFilters = filtersRef.current;
    onChangeRef.current({
      ...currentFilters,
      min_price: min,
      max_price: max,
      page: 1,
    });
  };

  const handleCategorySelect = (categoryId: number | string) => {
    const currentFilters = filtersRef.current;
    const isSelected =
      String(currentFilters.category_id ?? '') === String(categoryId);

    onChangeRef.current({
      ...currentFilters,
      category_id: isSelected ? undefined : categoryId,
      page: 1,
    });
  };

  const handleBrandSelect = (brandId: number | string) => {
    const currentFilters = filtersRef.current;
    const selectedBrand = currentFilters.brand_id ?? currentFilters.brand;
    const isSelected = String(selectedBrand ?? '') === String(brandId);

    onChangeRef.current({
      ...currentFilters,
      brand_id: isSelected ? undefined : brandId,
      brand: undefined,
      page: 1,
    });
  };

  const handleResetAll = () => {
    setLocalSearch('');
    setPriceInputs((previous) => ({
      ...previous,
      minPrice: '',
      maxPrice: '',
    }));
    onReset();
  };

  const sectionButtonClass =
    'flex w-full items-center justify-between gap-3 rounded-control py-2 text-sm font-semibold text-text-primary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  const inputClass =
    'w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20';

  const renderSectionToggle = (
    section: FilterSection,
    label: string,
  ) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      aria-expanded={openSections[section]}
      aria-controls={`product-filter-${section}`}
      className={sectionButtonClass}
    >
      <span>{label}</span>
      {openSections[section] ? (
        <ChevronUp aria-hidden="true" className="h-4 w-4 shrink-0" />
      ) : (
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0" />
      )}
    </button>
  );

  const FilterContent = (
    <div className="flex flex-col gap-5 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 text-base font-bold text-text-primary">
          <Filter aria-hidden="true" className="h-5 w-5 text-primary" />
          <h2>{t('title')}</h2>
        </div>

        <button
          type="button"
          onClick={handleResetAll}
          className="inline-flex items-center gap-1 rounded-control text-xs font-medium text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{t('reset')}</span>
        </button>
      </div>

      {/* Search */}
      {!disabledSearch && 
        <section className="border-b border-border pb-4">
          {renderSectionToggle('search', t('search.title'))}

          {openSections.search && (
            <div id="product-filter-search">
              <form onSubmit={handleSearchSubmit} className="relative mt-3">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={localSearch}
                  disabled={disabledSearch}
                  onChange={(event) => setLocalSearch(event.target.value)}
                  onFocus={() => {
                    isSearchFocusedRef.current = true;
                  }}
                  onBlur={() => {
                    isSearchFocusedRef.current = false;
                    setLocalSearch(filtersRef.current.search ?? '');
                  }}
                  placeholder={t('search.placeholder')}
                  aria-label={t('search.label')}
                  className={`${inputClass} ${
                    disabledSearch ? 'opacity-50 cursor-not-allowed' : ''
                  } ${isRTL ? 'pl-10 text-right' : 'pr-10 text-left'}`}
                />

                <button
                  type="submit"
                  disabled={disabledSearch}
                  aria-label={t('search.submit')}
                  className={`absolute top-1/2 -translate-y-1/2 rounded-control p-1 text-text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 disabled:cursor-not-allowed ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}
                >
                  <Search aria-hidden="true" className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </section>
      }

      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-b border-border pb-4">
          {renderSectionToggle('category', t('categories.title'))}

          {openSections.category && (
            <div
              id="product-filter-category"
              className="mt-3 flex max-h-48 flex-col gap-1.5 overflow-y-auto"
            >
              {categories.map((category) => {
                const isSelected =
                  String(filters.category_id ?? '') === String(category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    aria-pressed={isSelected}
                    className={`flex w-full items-center justify-between rounded-control px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-text-secondary hover:bg-surface-hover'
                    }`}
                  >
                    <span>{category.name}</span>
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Price */}
      <section className="border-b border-border pb-4">
        {renderSectionToggle('price', t('price.title'))}

        {openSections.price && (
          <div id="product-filter-price" className="mt-3 space-y-3">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="product-filter-min-price"
                  className="mb-1 block text-xs text-text-muted"
                >
                  {t('price.min')}
                </label>
                <input
                  id="product-filter-min-price"
                  type="number"
                  min="1"
                  step="any"
                  inputMode="decimal"
                  placeholder={t('price.minPlaceholder')}
                  value={minPrice}
                  onChange={(event) =>
                    setPriceInputs((previous) => ({
                      ...previous,
                      minPrice: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <span aria-hidden="true" className="mt-8 text-text-muted">
                –
              </span>

              <div className="min-w-0 flex-1">
                <label
                  htmlFor="product-filter-max-price"
                  className="mb-1 block text-xs text-text-muted"
                >
                  {t('price.max')}
                </label>
                <input
                  id="product-filter-max-price"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder={t('price.maxPlaceholder')}
                  value={maxPrice}
                  onChange={(event) =>
                    setPriceInputs((previous) => ({
                      ...previous,
                      maxPrice: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {minPrice.trim() !== '' &&
              maxPrice.trim() !== '' &&
              Number(minPrice) > Number(maxPrice) && (
                <p role="alert" className="text-xs text-error">
                  {t('price.invalidRange')}
                </p>
              )}

            <button
              type="button"
              onClick={handlePriceApply}
              className="w-full rounded-control bg-surface-secondary px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-primary hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t('price.apply')}
            </button>
          </div>
        )}
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="pb-4">
          {renderSectionToggle('brand', t('brands.title'))}

          {openSections.brand && (
            <div
              id="product-filter-brand"
              className="mt-3 flex max-h-48 flex-col gap-1 overflow-y-auto"
            >
              {brands.map((brand) => {
                const selectedBrand = filters.brand_id ?? filters.brand;
                const isSelected =
                  String(selectedBrand ?? '') === String(brand.id);

                return (
                  <label
                    key={brand.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-control px-2 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandSelect(brand.id)}
                      className="h-4 w-4 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <span>{brand.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="product-filters-sidebar"
        className="inline-flex items-center gap-2 rounded-control bg-surface-secondary px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Filter aria-hidden="true" className="h-4 w-4 text-primary" />
        <span>{t('filtersButton', 'الفلاتر')}</span>
      </button>

      {isOpen && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[var(--z-sidebar)]"
        >
          {/* الخلفية المعتمة */}
          <button
            type="button"
            aria-label={t('close')}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-xs"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
            id="product-filters-sidebar"
            className={`absolute top-[var(--header-height)] bottom-0 flex w-full max-w-xs flex-col overflow-y-auto bg-surface shadow-xl h-[calc(100vh-var(--header-height))] ${
              isRTL ? 'right-0' : 'left-0'
            }`}
          >
            <div className="flex items-center justify-end border-b border-border p-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t('close')}
                className="rounded-control p-2 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            {FilterContent}
          </aside>
        </div>
      )}
    </>
  );
};