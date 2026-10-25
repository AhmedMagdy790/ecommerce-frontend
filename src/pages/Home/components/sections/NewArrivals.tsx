// src/pages/Home/components/sections/NewArrivals.tsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import ProductCard from "../products/ProductCard";
import { mapCmsProducts } from "@/features/product/adapters/cmsProductCardAdapter";
import { Container } from "@/shared/components/layout/Container";
import type { Section } from "@/features/cms/section/model/types/section.types";

interface NewArrivalsProps {
  section: Section<string>;
}

export default function NewArrivals({ section }: NewArrivalsProps) {
  const { t } = useTranslation("home");
  const { lang, isRTL } = useLang();

  const rawItems = Array.isArray(section?.data) ? section.data : [];
  
  // تحويل البيانات باستخدام Adapter
  const products = mapCmsProducts(rawItems, lang);

  if (!products.length) return null;

  const sectionTitle = section.name || (lang === "ar" ? "وصل حديثاً" : "New Arrivals");
  const badgeText = lang === "ar" ? "جديد" : "NEW";

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="py-16 bg-background"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-10 flex items-center justify-between border-b border-border pb-4">
          {sectionTitle && (
            <div className="flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-primary" />
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                {sectionTitle}
              </h2>
            </div>
          )}

          <Link
            to="/products?sort=newest"
            className="text-sm font-semibold text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control"
          >
            {t("newArrivals.viewAll", lang === "ar" ? "عرض الكل" : "View All")}
          </Link>
        </div>

        {/* Responsive Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id ?? idx} 
              product={product} 
              badge={badgeText} 
            />
          ))}
        </div>
      </Container>
    </section>
  );
}