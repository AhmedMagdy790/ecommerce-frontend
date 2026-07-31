// src/pages/Home/components/sections/BestSellers.tsx
import type { Section } from "../SectionRenderer";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { ProductCard } from "@/features/product/components/ProductCard";
import { Link } from "react-router-dom";

interface BestSellersProps {
  section: Section & {
    data?: any[];
    products?: any[];
    items?: any[];
  };
}

export default function BestSellers({ section }: BestSellersProps) {
  const { t } = useTranslation("home");
  const { lang } = useLang();

  // Support section.data, products, or items
  const rawItems = section.data || section.products || section.items || [];

  // Helper to safely extract localized text
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return "";
    if (typeof textObj === "string") return textObj;
    return textObj[lang] || textObj.en || textObj.ar || "";
  };

  const products = rawItems.map((item: any) => ({
    ...item,
    name: getLocalizedText(item.name),
    description: getLocalizedText(item.description),
  }));

  if (!products.length) return null;

  const sectionTitle = getLocalizedText(section.name);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
            {sectionTitle}
          </h2>
          <Link
            to="/shop?sort=best-selling"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {t("bestSellers.viewAll", "View All")}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              badge="bestSellers.badge"
            />
          ))}
        </div>
      </div>
    </section>
  );
}