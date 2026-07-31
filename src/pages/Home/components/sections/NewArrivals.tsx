import { useTranslation } from "react-i18next";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useLang } from "@/shared/context/LanguageContext";
import type { ProductSummary } from "@/features/product/types/product";

interface NewArrivalsProps {
  title: string;
  products: ProductSummary[];
}

export default function NewArrivals({ title, products = [] }: NewArrivalsProps) {
  const { t } = useTranslation("home");
  const { lang } = useLang();

  const getLocalizedText = (text: string) => {
    if (!text) return "";
    return t(text);
  };

  if (!products.length) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[var(--container-xl)]">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
            {getLocalizedText(title)}
          </h2>

          <a
            href="/shop?sort=newest"
            className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            {t("newArrivals.viewAll", lang === "ar" ? "عرض الكل" : "View All")}
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              badge="newArrivals.badge" 
            />
          ))}
        </div>
      </div>
    </section>
  );
}