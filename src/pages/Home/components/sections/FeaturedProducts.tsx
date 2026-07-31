// src/pages/Home/components/sections/FeaturedProducts.tsx
import { useLang } from "@/shared/context/LanguageContext";
import { localize } from "@/shared/utils/localize";
import ProductCard from "../products/ProductCard";
import type { LocalizedText } from "@/shared/utils/localizedText";
import type { Product } from "@/features/product/types/product";
import { mapCmsProducts } from "@/features/product/adapters/cmsProductCardAdapter";
import type { ApiProduct } from "@/features/product/types/api";


export interface Section<T = unknown> {
  id: number;
  key: string;
  type: string;
  name: LocalizedText;

  data?: T[];
  items?: T[];
}

interface FeaturedProductsProps {
  section: Section<ApiProduct>;
}

export default function FeaturedProducts({
  section,
}: FeaturedProductsProps) {
  const { lang, isRTL } = useLang();

  const products = mapCmsProducts(
    section.data ?? [],
    lang
  );

  if (!products.length) return null;

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden px-[var(--spacing-6)] py-[var(--spacing-20)]"
    >
      {/* Ambient Background Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none blur-[140px] bg-[var(--color-primary)]" />

      <div className="relative mx-auto max-w-[var(--container-xl)]">
        
        {/* Modern Section Header with Subtitle Badge & Action link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[var(--spacing-12)] gap-[var(--spacing-4)]">
          <div className="flex flex-col gap-[var(--spacing-2)]">
            <div className="inline-flex items-center gap-[var(--spacing-2)] w-fit px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)] tracking-wider uppercase">
                {lang === "ar" ? "منتجات مميزة خصيصاً لك" : "Handpicked For You"}
              </span>
            </div>

            <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight">
              {localize(section.name, lang)}
            </h2>
          </div>

          <a 
            href="/products" 
            className="inline-flex items-center gap-[var(--spacing-2)] text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-primary)] transition-colors duration-200 hover:opacity-80"
          >
            <span>{lang === "ar" ? "عرض كل المنتجات" : "View All Products"}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-[var(--spacing-6)] sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}