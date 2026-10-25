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
    <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col gap-6 w-full">
      
      {/* Main Active Image Viewport */}
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-2xl)] bg-surface-secondary border border-border shadow-xs group">
        <img
          src={activeImage}
          alt={lang === "ar" ? "صورة المنتج الرئيسية" : "Main Product View"}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
        />
        
        {/* Subtle Zoom/Badge Overlay Hint */}
        <div className="absolute top-4 end-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium pointer-events-none">
          {lang === "ar" ? "اسحب للتكبير" : "Hover to Zoom"}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {images.map((image, index) => {
            const isActive = activeImage === image;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`Switch to image ${index + 1}`}
                className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? "border-primary ring-2 ring-primary/30 scale-105 shadow-md"
                    : "border-border opacity-70 hover:opacity-100 hover:border-border-hover"
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