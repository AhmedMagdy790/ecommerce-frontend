// src/pages/Home/components/products/ProductCard.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import type { CmsProductCardViewModel } from "@/features/product/adapters/cmsProductCardAdapter";

interface ProductCardProps {
  product: CmsProductCardViewModel;
  badge?: string;
}

const PLACEHOLDER_IMAGE = "/images/placeholders/product.webp";

export default function ProductCard({ product, badge }: ProductCardProps) {
  // استخراج القيم بأمان سواء جاء الكائن مباشرة كـ ViewModel أو كـ Raw Product Object
  const title = product.name || "";
  const rawImage = product.image || PLACEHOLDER_IMAGE;
  const link = product.link || (product.slug ? `/products/${product.slug}` : `/products/${product.id}`);
  const description = product.description || "";
  const numericPrice = typeof product.price === "number" ? product.price : parseFloat(product.price) || 0;

  const [imgSrc, setImgSrc] = useState(rawImage);

  // تنسيق السعر بعملة الجنيه المصري (EGP) بالاعتماد على التنسيق الافتراضي للمتصفح
  const formattedPrice = new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(numericPrice);

  return (
    <Link
      to={link}
      className="group relative flex flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-xs transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40"
    >
      {/* Image Container with Subtle Zoom & Badge Area */}
      <div className="relative aspect-square overflow-hidden bg-surface-secondary">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
          className="h-full w-full object-cover object-center transition-transform duration-[var(--duration-slow)] ease-[var(--ease-default)] group-hover:scale-110"
        />
        
        {/* Optional Badge */}
        {badge && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
            {badge}
          </div>
        )}

        {/* Quick Overlay Gradient for Modern Touch */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-2 line-clamp-1 text-base sm:text-lg font-bold text-text-primary tracking-tight">
          {title}
        </h3>

        {description && (
          <p className="mb-4 sm:mb-6 flex-1 line-clamp-2 text-xs sm:text-sm leading-relaxed text-text-secondary font-medium">
            {description}
          </p>
        )}

        {/* Footer / Price & Action Pill */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/60">
          <span className="text-base sm:text-lg font-bold text-primary">
            {formattedPrice}
          </span>

          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-surface-secondary border border-border text-text-primary transition-all duration-[var(--duration-fast)] group-hover:bg-primary group-hover:text-white group-hover:border-transparent">
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 rtl:rotate-180 rtl:-scale-x-100" 
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