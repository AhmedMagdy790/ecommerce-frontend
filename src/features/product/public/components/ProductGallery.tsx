
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import type { ProductGalleryItem } from "../../model/types/product.types";

interface ProductGalleryProps {
  gallery: ProductGalleryItem[];
}

export default function ProductGallery({
  gallery,
}: ProductGalleryProps) {
  const { t } = useTranslation();
  const { isRTL } = useLang();

  const images = gallery ?? [];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const activeImage =
    selectedImage ?? images[0]?.url ?? "/images/placeholders/product.webp";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex w-full flex-col gap-6">
      <div className="group relative aspect-square overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-surface-secondary shadow-xs">
        <img
          src={activeImage}
          alt={t("productGallery.mainImage")}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
        />

        <div className="pointer-events-none absolute end-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {t("productGallery.zoomHint")}
        </div>
      </div>

      {images.length > 1 && (
        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const isActive = activeImage === image.url;

            return (
              <button
                key={`${image.id}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image.url)}
                aria-label={t("productGallery.selectImage", {
                  number: index + 1,
                })}
                aria-pressed={isActive}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-24 sm:w-24 ${
                  isActive
                    ? "scale-105 border-primary ring-2 ring-primary/30 shadow-md"
                    : "border-border opacity-70 hover:border-border-hover hover:opacity-100"
                }`}
              >
                <img
                  src={image.url}
                  alt={t("productGallery.thumbnailAlt", {
                    number: index + 1,
                  })}
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