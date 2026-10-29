import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Product } from "../../model/types/product.types";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";

interface ProductCardProps {
  product: Product<string>;
  badge?: string;
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const { t, i18n } = useTranslation("home");
  const { lang } = useLang();

  const productName = getLocalizedName(product.name, lang);

  const image =
    product.thumbnail ||
    product.featured_image ||
    "/images/placeholders/product.webp";

  const rawPrice = product.starting_at ?? product.price;

  const price =
    rawPrice !== null &&
    rawPrice !== undefined &&
    rawPrice !== ""
      ? Number(rawPrice)
      : null;

  const rawOldPrice = product.old_price;

  const oldPrice =
    rawOldPrice !== null &&
    rawOldPrice !== undefined &&
    rawOldPrice !== ""
      ? Number(rawOldPrice)
      : null;

  const hasValidPrice =
    price !== null && Number.isFinite(price) && price >= 0;

  const hasDiscount =
    hasValidPrice &&
    oldPrice !== null &&
    Number.isFinite(oldPrice) &&
    oldPrice > price &&
    oldPrice > 0;

  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(
      i18n.language.startsWith("ar") ? "ar-EG" : "en-US",
      {
        style: "currency",
        currency: "EGP",
        maximumFractionDigits: 2,
      },
    ).format(amount);

  return (
    <Link
      to={`/products/${product.slug || product.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
          {t(badge)}
        </span>
      )}

      {hasDiscount && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
          -{discountPercentage}%
        </span>
      )}

      <div className="aspect-square overflow-hidden bg-surface-secondary">
        <img
          src={image}
          alt={productName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-text-primary">
          {productName}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {hasDiscount && oldPrice !== null && (
            <span className="text-sm text-text-secondary line-through">
              {formatPrice(oldPrice)}
            </span>
          )}

          {hasValidPrice ? (
            <span className="font-bold text-primary">
              {formatPrice(price)}
            </span>
          ) : (
            <span className="text-sm text-text-secondary">
              {t("priceUnavailable", "Price unavailable")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}