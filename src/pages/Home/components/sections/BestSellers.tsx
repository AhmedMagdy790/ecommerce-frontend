import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/Products/ProductCard";
import { type ProductSummary } from "@/types/product";

interface BestSellersProps {
  title: string;
  products: ProductSummary[];
}

export default function BestSellers({ title, products = [] }: BestSellersProps) {
  const { t } = useTranslation("home");

  if (!products.length) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
            {t(title)}
          </h2>
          <a
            href="/shop?sort=best-selling"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {t("bestSellers.viewAll")}
          </a>
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