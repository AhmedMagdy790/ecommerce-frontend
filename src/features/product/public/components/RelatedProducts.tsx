// src/pages/ProductDetails/components/RelatedProducts.tsx

import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";
import type { RelatedProduct } from "../../adapters/productDetailsAdapter";

interface RelatedProductsProps {
  data?: {
    title?: string | { ar?: string; en?: string };
    products?: RelatedProduct[];
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

              const image =
                product.thumbnail ||
                product.featured_image ||
                "/images/placeholders/product.webp";

              const price = product.starting_at ?? product.price ?? null;

              return (
                <a
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-xs transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
                    <img
                      src={image}
                      alt={productName || t("relatedProducts.productImage")}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-text-primary transition-colors group-hover:text-primary sm:text-base">
                      {productName}
                    </h3>

                    <div className="flex flex-wrap items-baseline gap-2">
                      {price !== null && (
                        <span className="text-base font-bold text-primary sm:text-lg">
                          {price}
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