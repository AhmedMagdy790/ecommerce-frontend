// src/pages/Home/components/products/ProductCard.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import type { CmsProductCardViewModel } from "@/features/product/adapters/cmsProductCardAdapter";

interface ProductCardProps {
  product: CmsProductCardViewModel;
  badge?: string;
}

const PLACEHOLDER_IMAGE = "/images/placeholders/product.webp";

export default function ProductCard({ product, badge }: ProductCardProps) {
  const { lang, isRTL } = useLang();

  // استخراج القيم بأمان سواء جاء الكائن مباشرة كـ ViewModel أو كـ Raw Product Object
  const title = product.name || "";
  const rawImage = product.image || PLACEHOLDER_IMAGE;
  const link = product.link || (product.slug ? `/products/${product.slug}` : `/products/${product.id}`);
  const description = product.description || "";
  const numericPrice = typeof product.price === "number" ? product.price : parseFloat(product.price) || 0;

  const [imgSrc, setImgSrc] = useState(rawImage);

  // تنسيق السعر بناءً على عملة الجنيه المصري (EGP) وتغيير الترقيم حسب اللغة
  const formattedPrice = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(numericPrice);

  return (
    <Link
      to={link}
      dir={isRTL ? "rtl" : "ltr"}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-primary)]/40"
    >
      {/* Image Container with Subtle Zoom & Badge Area */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-secondary)]">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
          className="h-full w-full object-cover object-center transition-transform duration-[var(--duration-slow)] ease-[var(--ease-default)] group-hover:scale-110"
        />
        
        {/* Optional Badge */}
        {badge && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 rounded-[var(--radius-full)] bg-[var(--color-primary)] px-3 py-1 text-[var(--text-xs)] font-[var(--font-bold)] text-white shadow-md">
            {badge}
          </div>
        )}

        {/* Quick Overlay Gradient for Modern Touch */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-[var(--spacing-5)] sm:p-[var(--spacing-6)]">
        <h3 className="mb-[var(--spacing-2)] line-clamp-1 text-[var(--text-base)] sm:text-[var(--text-lg)] font-[var(--font-semibold)] text-[var(--color-text-primary)] tracking-tight">
          {title}
        </h3>

        {description && (
          <p className="mb-[var(--spacing-4)] sm:mb-[var(--spacing-6)] flex-1 line-clamp-2 text-[var(--text-xs)] sm:text-[var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}

        {/* Footer / Price & Action Pill */}
        <div className="mt-auto flex items-center justify-between pt-[var(--spacing-3)] border-t border-[var(--color-border)]/60">
          <span className="text-[var(--text-base)] sm:text-[var(--text-lg)] font-[var(--font-bold)] text-[var(--color-primary)]">
            {formattedPrice}
          </span>

          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all duration-[var(--duration-fast)] group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-text-inverse)] group-hover:border-transparent">
            <svg 
              className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isRTL ? "rotate-180 -scale-x-100" : ""}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}