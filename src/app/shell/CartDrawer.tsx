import type { ProductDetails } from "@/features/product/adapters/productDetailsAdapter";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  product: ProductDetails;
  badge?: string;
}

const PLACEHOLDER = "/images/placeholders/product.webp";

export function ProductCard({ product, badge }: ProductCardProps) {
  const { t } = useTranslation("home");
  const { lang, isRTL } = useLang();

  const productName = getLocalizedName(product.name, lang);
  const image = product.image || PLACEHOLDER;

  const hasOldPrice =
    product.oldPrice !== null &&
    product.oldPrice !== undefined &&
    product.oldPrice !== "";

  return (
    <a
      href={`/products/${product.slug}`}
      dir={isRTL ? "rtl" : "ltr"}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-secondary">
        <img
          src={image}
          alt={productName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {badge && (
          <span className="absolute start-3 top-3 z-10 rounded-full bg-black px-3 py-1 text-xs text-white">
            {t(badge, { defaultValue: badge })}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate font-semibold text-text-primary">
          {productName}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {product.price !== null && (
            <span className="font-bold text-primary">
              {product.price}
            </span>
          )}

          {hasOldPrice && (
            <span className="text-sm text-text-secondary line-through">
              {product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}