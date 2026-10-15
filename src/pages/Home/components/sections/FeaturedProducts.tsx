// src/pages/Home/components/sections/FeaturedProducts.tsx
import { useLang } from "@/shared/context/LanguageContext";
import ProductCard from "../products/ProductCard";
import { mapCmsProducts } from "@/features/product/adapters/cmsProductCardAdapter";
import { useTranslation } from "react-i18next";
import type { Section } from "@/features/cms/section/model/types/section.types";

interface FeaturedProductsProps {
  section: Section<string>;
}

export default function FeaturedProducts({ section }: FeaturedProductsProps) {
  const { lang, isRTL } = useLang();
  const { t } = useTranslation("home");

  console.log("section", section)

  // استخراج العناصر بأمان من section.data مباشرة
  const rawItems = Array.isArray(section?.data) ? section.data : [];

  // 2. تحويل البيانات باستخدام Adapter
  const products = mapCmsProducts(rawItems, lang);

  if (!products.length) return null;

  // 3. استخراج عنوان القسم بأمان
  const sectionTitle = section.name;

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden px-[var(--spacing-6)] py-[var(--spacing-20)]"
    >
      {/* Ambient Background Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none blur-[140px] bg-[var(--color-primary)]" />

      <div className="relative mx-auto max-w-[var(--container-xl)]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[var(--spacing-12)] gap-[var(--spacing-4)]">
          <div className="flex flex-col gap-[var(--spacing-2)]">
            <div className="inline-flex items-center gap-[var(--spacing-2)] w-fit px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)] tracking-wider uppercase">
                {t?.("products.handpicked") ?? (lang === "ar" ? "منتجات مميزة خصيصاً لك" : "Handpicked For You")}
              </span>
            </div>

            {sectionTitle && (
              <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight">
                {sectionTitle}
              </h2>
            )}
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