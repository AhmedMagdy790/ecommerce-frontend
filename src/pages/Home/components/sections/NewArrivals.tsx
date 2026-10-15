// src/pages/Home/components/sections/NewArrivals.tsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import type { Section } from "@/features/cms/section/model/types/section.types";
import ProductCard from "../products/ProductCard";
import { mapCmsProducts } from "@/features/product/adapters/cmsProductCardAdapter";

interface NewArrivalsProps {
  section: Section<string>;
}

export default function NewArrivals({ section }: NewArrivalsProps) {
  const { t } = useTranslation("home");
  const { lang, isRTL } = useLang();

  console.log("section", section)
  console.log("section", section)

    const rawItems = Array.isArray(section?.data) ? section.data : [];
  
    // 2. تحويل البيانات باستخدام Adapter
    const products = mapCmsProducts(rawItems, lang);
  

  const sectionTitle = section.name || (lang === "ar" ? "وصل حديثاً" : "New Arrivals");
  const badgeText = lang === "ar" ? "جديد" : "NEW";

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="px-[var(--spacing-6)] py-[var(--spacing-16)]"
    >
      <div className="mx-auto max-w-[var(--container-2xl,1400px)]">
        {/* Section Header */}
        <div className="mb-[var(--spacing-10)] flex items-center justify-between border-b border-[var(--color-border)] pb-[var(--spacing-4)]">
          {sectionTitle && (
            <div className="flex items-center gap-[var(--spacing-3)]">
              <span className="h-6 w-1.5 rounded-[var(--radius-full)] bg-[var(--color-primary)]" />
              <h2 className="text-[var(--text-2xl)] sm:text-[var(--text-3xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight">
                {sectionTitle}
              </h2>
            </div>
          )}

          <Link
            to="/products?sort=newest"
            className="text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-dark)] hover:underline"
          >
            {t("newArrivals.viewAll", lang === "ar" ? "عرض الكل" : "View All")}
          </Link>
        </div>

        {/* Responsive Products Grid */}
        <div className="grid grid-cols-2 gap-[var(--spacing-4)] sm:gap-[var(--spacing-6)] md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id ?? idx} 
              product={product} 
              badge={badgeText} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}