// src/pages/ProductDetails/components/RelatedProducts.tsx

import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

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
      className="mt-[var(--spacing-16)] border-t border-[var(--color-border)] pt-[var(--spacing-10)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-[var(--spacing-8)]">
        <h2 
          className="text-[var(--text-2xl)] sm:text-[var(--text-3xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)]"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {sectionTitle}
        </h2>

        <a
          href="/shop"
          className="inline-flex items-center gap-[var(--spacing-2)] text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-primary)] transition-opacity hover:opacity-80 group"
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
      <div className="grid grid-cols-2 gap-[var(--spacing-4)] sm:gap-[var(--spacing-6)] md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const productName = getLocalizedText(product.name);

          return (
            <a
              key={product.id}
              href={product.link || `/products/${product.id}`}
              className="group relative flex flex-col overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-primary)]/40"
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface-secondary)]">
                <img
                  src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"}
                  alt={productName || "Product Image"}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-110"
                  loading="lazy"
                />

                {/* Quick Add Overlay Button on Hover */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/90 backdrop-blur-md text-[var(--color-text-primary)] text-[var(--text-xs)] font-[var(--font-semibold)] shadow-md border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                    <ShoppingBag size={14} />
                    <span>{lang === "ar" ? "عرض التفاصيل" : "Quick View"}</span>
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 p-[var(--spacing-4)] sm:p-[var(--spacing-5)] justify-between">
                <h3 
                  className="font-[var(--font-semibold)] text-[var(--text-sm)] sm:text-[var(--text-base)] text-[var(--color-text-primary)] line-clamp-2 mb-[var(--spacing-3)] group-hover:text-[var(--color-primary)] transition-colors"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {productName}
                </h3>

                <div className="flex items-baseline gap-[var(--spacing-2)] flex-wrap">
                  <span className="text-[var(--text-base)] sm:text-[var(--text-lg)] font-[var(--font-bold)] text-[var(--color-primary)]">
                    ${product.price}
                  </span>

                  {product.oldPrice && (
                    <span className="text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--color-text-muted)] line-through">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}