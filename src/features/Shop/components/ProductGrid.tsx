// src/pages/Shop/components/ProductGrid.tsx

import { ShoppingBag, Star } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface ProductCardData {
  id: string | number;
  slug: string;
  name: string;
  image: string;
  price: number | string;
  oldPrice?: number | string;
  link?: string;
  rating?: number;
  reviewsCount?: number;
}

interface ProductGridProps {
  products: ProductCardData[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { lang, isRTL } = useLang();

  if (!products || products.length === 0) {
    return (
      <div 
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full min-h-[400px] flex flex-col items-center justify-center rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--spacing-12)] text-center shadow-xs"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] mb-[var(--spacing-4)] border border-[var(--color-border)]">
          <ShoppingBag size={32} />
        </div>
        <h3 
          className="text-[var(--text-xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] mb-[var(--spacing-2)]"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {lang === "ar" ? "لا توجد منتجات متاحة" : "No Products Found"}
        </h3>
        <p 
          className="text-[var(--text-sm)] text-[var(--color-text-secondary)] max-w-sm"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {lang === "ar" ? "لم يتم العثور على منتجات تطابق خيارات البحث الحالية. جرب تغيير عوامل التصفية." : "We couldn't find any products matching your current filters. Try adjusting your search criteria."}
        </p>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full">
      
      {/* Grid Header Results Count */}
      <div className="flex items-center justify-between mb-[var(--spacing-6)]">
        <p 
          className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-secondary)]"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {lang === "ar" ? `عرض ${products.length} منتج` : `Showing ${products.length} products`}
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="grid grid-cols-2 gap-[var(--spacing-4)] sm:gap-[var(--spacing-6)] lg:grid-cols-3">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.link || `/products/${product.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-primary)]/40"
          >
            {/* Image Box */}
            <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface-secondary)]">
              <img
                src={product.image || "/images/placeholders/product.webp"}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-110"
                loading="lazy"
              />

              {/* Quick View Hover Action Badge */}
              <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/90 backdrop-blur-md text-[var(--color-text-primary)] text-[var(--text-xs)] font-[var(--font-semibold)] shadow-md border border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  <ShoppingBag size={14} />
                  <span>{lang === "ar" ? "عرض التفاصيل" : "Quick View"}</span>
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col flex-1 p-[var(--spacing-4)] sm:p-[var(--spacing-5)] justify-between">
              
              <div>
                {/* Optional Rating Preview */}
                {product.rating !== undefined && product.rating > 0 && (
                  <div className="flex items-center gap-1 mb-[var(--spacing-2)] text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[var(--text-xs)] font-[var(--font-medium)] text-[var(--color-text-secondary)]">
                      {product.rating} {product.reviewsCount ? `(${product.reviewsCount})` : ""}
                    </span>
                  </div>
                )}

                <h3 
                  className="font-[var(--font-semibold)] text-[var(--text-sm)] sm:text-[var(--text-base)] text-[var(--color-text-primary)] line-clamp-2 mb-[var(--spacing-3)] group-hover:text-[var(--color-primary)] transition-colors"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {product.name}
                </h3>
              </div>

              {/* Price & Discount Row */}
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
        ))}
      </div>

    </div>
  );
}