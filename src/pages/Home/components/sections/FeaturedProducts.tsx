// src/pages/Home/components/sections/FeaturedProducts.tsx

import { useLang } from "@/shared/context/LanguageContext";
import ProductCard from "../products/ProductCard";
import { mapCmsProducts } from "@/features/product/adapters/cmsProductCardAdapter";
import { useTranslation } from "react-i18next";
import { Container } from "@/shared/components/layout/Container";
import type { Section } from "@/features/cms/section/model/types/section.types";

interface FeaturedProductsProps {
  section: Section<string>;
}

export default function FeaturedProducts({ section }: FeaturedProductsProps) {
  const { lang, isRTL } = useLang();
  const { t } = useTranslation("home");

  // استخراج العناصر بأمان من section.data مباشرة
  const rawItems = Array.isArray(section?.data) ? section.data : [];

  // تحويل البيانات باستخدام Adapter
  const products = mapCmsProducts(rawItems, lang);

  if (!products.length) return null;

  // استخراج عنوان القسم بأمان
  const sectionTitle = section.name;

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden py-20 bg-background"
    >
      {/* Ambient Background Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none blur-[140px] bg-primary" />

      <Container className="relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full bg-surface border border-border shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                {t?.("products.handpicked") ?? (lang === "ar" ? "منتجات مميزة خصيصاً لك" : "Handpicked For You")}
              </span>
            </div>

            {sectionTitle && (
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                {sectionTitle}
              </h2>
            )}
          </div>

          <a 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control w-fit"
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}