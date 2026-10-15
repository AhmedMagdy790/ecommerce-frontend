// src/pages/ProductDetails/components/ProductGallery.tsx

import { useState } from "react";
import { useLang } from "@/shared/context/LanguageContext";

interface ProductGalleryProps {
  data?: {
    images?: string[];
  };
}

export default function ProductGallery({
  data,
}: ProductGalleryProps) {
  const { lang, isRTL } = useLang();
  const images = data?.images && data.images.length > 0 ? data.images : ["/images/placeholders/product.webp"];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const activeImage = selectedImage ?? images[0] ?? "/images/placeholders/product.webp";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col gap-[var(--spacing-6)] w-full">
      
      {/* Main Active Image Viewport */}
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-3xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] group">
        <img
          src={activeImage}
          alt={lang === "ar" ? "صورة المنتج الرئيسية" : "Main Product View"}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
        />
        
        {/* Subtle Zoom/Badge Overlay Hint */}
        <div className="absolute top-4 end-4 px-[var(--spacing-3)] py-[var(--spacing-1)] rounded-[var(--radius-full)] bg-black/40 backdrop-blur-md text-white text-[var(--text-xs)] font-[var(--font-medium)] pointer-events-none">
          {lang === "ar" ? "اسحب للتكبير" : "Hover to Zoom"}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-[var(--spacing-4)] overflow-x-auto pb-[var(--spacing-2)] scrollbar-none">
          {images.map((image, index) => {
            const isActive = activeImage === image;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`Switch to image ${index + 1}`}
                className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-[var(--radius-2xl)] border transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] ${
                  isActive
                    ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 scale-105 shadow-md"
                    : "border-[var(--color-border)] opacity-70 hover:opacity-100 hover:border-[var(--color-border-hover)]"
                }`}
              >
                <img
                  src={image}
                  alt={`Product Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}