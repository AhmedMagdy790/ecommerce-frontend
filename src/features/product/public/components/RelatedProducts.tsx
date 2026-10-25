// src/pages/ProductDetails/components/RelatedProducts.tsx

import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

interface Product {
  id: string | number;
  name: string | { ar?: string; en?: string };
  image: string;
  price: number | string;
  oldPrice?: number | string;
  link?: string;
}

interface RelatedProductsProps {
  data?: {
    title?: string | { ar?: string; en?: string };
    products?: Product[];
  };
}

export default function RelatedProducts({
  data,
}: RelatedProductsProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  // Helper to safely extract localized text
  const getLocalizedText = (value?: string | { ar?: string; en?: string }) => {
    if (!value) return "";
    if (typeof value === "string") {
      return t(value, { defaultValue: value });
    }
    return value[lang as keyof typeof value] || value.en || value.ar || "";
  };

  const products = data?.products || [];

  if (products.length === 0) {
    return null;
  }

  const sectionTitle = getLocalizedText(data?.title) || t("relatedProducts.title", { defaultValue: lang === "ar" ? "منتجات ذات صلة" : "Related Products" });

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-16 border-t border-border pt-10 bg-background"
    >
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 
            className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {sectionTitle}
          </h2>

          <a
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            <span>{lang === "ar" ? "عرض الكل" : "View All"}</span>
            {isRTL ? (
              <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            ) : (
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const productName = getLocalizedText(product.name);

            return (
              <a
                key={product.id}
                href={product.link || `/products/${product.id}`}
                className="group relative flex flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-xs transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"}
                    alt={productName || "Product Image"}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Quick Add Overlay Button on Hover */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-card bg-surface/90 backdrop-blur-md text-text-primary text-xs font-semibold shadow-md border border-border hover:bg-primary hover:text-white transition-colors">
                      <ShoppingBag size={14} />
                      <span>{lang === "ar" ? "عرض التفاصيل" : "Quick View"}</span>
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
                  <h3 
                    className="font-semibold text-sm sm:text-base text-text-primary line-clamp-2 mb-3 group-hover:text-primary transition-colors"
                    style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                  >
                    {productName}
                  </h3>

                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      ${product.price}
                    </span>

                    {product.oldPrice && (
                      <span className="text-xs sm:text-sm text-text-muted line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}