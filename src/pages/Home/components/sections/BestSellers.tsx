// src/pages/Home/components/sections/BestSellers.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import ProductCard from "../products/ProductCard"; // أو المسار الموحد لديك
import { mapCmsProducts } from "@/features/product/adapters/cmsProductCardAdapter";
import type { Section } from "@/features/cms/section/model/types/section.types";

interface BestSellersProps {
  section: Section<string>;
}

export default function BestSellers({ section }: BestSellersProps) {
  const { lang, isRTL } = useLang();
  const { t } = useTranslation("home");

  // 1. استخراج العناصر المرجعة بأمان من section.data الموحدة
  const rawItems = Array.isArray(section?.data)
    ? section.data
    : Array.isArray(section?.items)
    ? section.items
    : [];

  // 2. تحويل البيانات باستخدام Adapter الموحد للنظام
  const products = mapCmsProducts(rawItems, lang);

  if (!products.length) return null;

  // 3. استخراج عنوان القسم
  const sectionTitle = typeof section.name === "string" 
    ? section.name 
    : (section.name as Record<string, string>)?.[lang] || "";

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="px-[var(--spacing-6)] py-[var(--spacing-16)]"
    >
      <div className="mx-auto max-w-[var(--container-xl)]">
        
        {/* Section Header */}
        <div className="mb-[var(--spacing-10)] flex items-center justify-between">
          <h2 className="text-[var(--text-3xl)] md:text-[var(--text-4xl)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
            {sectionTitle || (lang === "ar" ? "الأكثر مبيعاً" : "Best Sellers")}
          </h2>
          
          <Link
            to="/shop?sort=best-selling"
            className="text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-primary)] hover:underline"
          >
            {t("bestSellers.viewAll") ?? (lang === "ar" ? "عرض الكل" : "View All")}
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-[var(--spacing-6)] md:grid-cols-3 lg:grid-cols-4">
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