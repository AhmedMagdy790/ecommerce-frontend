// src/pages/Home/components/sections/BestSellers.tsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import ProductCard from "../products/ProductCard";
import { mapCmsProducts } from "@/features/product/adapters/cmsProductCardAdapter";
import { Container } from "@/shared/components/layout/Container";
import type { Section } from "@/features/cms/section/model/types/section.types";

interface BestSellersProps {
  section: Section<string>;
}

export default function BestSellers({ section }: BestSellersProps) {
  const { lang, isRTL } = useLang();
  const { t } = useTranslation("home");

  // استخراج العناصر المرجعة بأمان من section.data الموحدة
  const rawItems = Array.isArray(section?.data)
    ? section.data
    : Array.isArray(section?.items)
    ? section.items
    : [];

  // تحويل البيانات باستخدام Adapter الموحد للنظام
  const products = mapCmsProducts(rawItems, lang);

  if (!products.length) return null;

  // استخراج عنوان القسم
  const sectionTitle = typeof section.name === "string" 
    ? section.name 
    : (section.name as Record<string, string>)?.[lang] || "";

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="py-16 bg-background"
    >
      <Container>
        
        {/* Section Header */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            {sectionTitle || (lang === "ar" ? "الأكثر مبيعاً" : "Best Sellers")}
          </h2>
          
          <Link
            to="/shop?sort=best-selling"
            className="text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control"
          >
            {t("bestSellers.viewAll") ?? (lang === "ar" ? "عرض الكل" : "View All")}
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
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