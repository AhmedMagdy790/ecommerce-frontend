// src/pages/Home/components/products/ProductCard.tsx

import { Link } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import type { LocalizedText } from "@/shared/utils/localizedText";

export interface ProductCardData {
  id: number;
  name: LocalizedText | string;
  description?: LocalizedText | string;
  image: string;
  link: string;
  price: string | number;
}

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang, isRTL } = useLang();


  const localize = (value?: LocalizedText | string): string => {
    if (!value) return "";
    if (typeof value === "string") return value;

    return value[lang as keyof LocalizedText] ?? value.en ?? value.ar ?? "";
  };

  return (
    <Link
      to={product.link}
      dir={isRTL ? "rtl" : "ltr"}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-primary)]/40"
    >
      {/* Image Container with Subtle Zoom & Badge Area */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-secondary)]">
        <img
          src={product.image}
          alt={localize(product.name)}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-[var(--duration-slow)] ease-[var(--ease-default)] group-hover:scale-110"
        />
        
        {/* Quick Overlay Gradient for Modern Touch */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-[var(--spacing-6)]">
        <h3 className="mb-[var(--spacing-2)] line-clamp-1 text-[var(--text-lg)] font-[var(--font-semibold)] text-[var(--color-text-primary)] tracking-tight">
          {localize(product.name)}
        </h3>

        <p className="mb-[var(--spacing-6)] flex-1 line-clamp-2 text-[var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
          {localize(product.description)}
        </p>

        {/* Footer / Price & Action Pill */}
        <div className="mt-auto flex items-center justify-between pt-[var(--spacing-2)] border-t border-[var(--color-border)]/60">
          <span className="text-[var(--text-lg)] font-[var(--font-bold)] text-[var(--color-primary)]">
            {product.price}
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all duration-[var(--duration-fast)] group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-text-inverse)] group-hover:border-transparent">
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