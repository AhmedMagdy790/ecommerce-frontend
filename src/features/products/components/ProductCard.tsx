// src/components/ProductCard.tsx

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Eye, Heart, Star } from "lucide-react";

import type { Product } from "@/features/product/model/types/product.types";
import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";

interface ProductCardProps {
  product: Product<string>;
  onAddToCart?: (
    product: Product<string>,
    variant?: ProductVariant<string>,
  ) => void;
  onQuickView?: (product: Product<string>) => void;
  onToggleWishlist?: (product: Product<string>) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const { t, i18n } = useTranslation("productCard");

  // تحديد الـ Locale تلقائياً بناءً على اللغة الحالية لـ i18next دون الحاجة لـ useLang
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  const mainImage = product.image;

  const primaryVariant: ProductVariant<string> | undefined =
    Array.isArray(product.variants) ? product.variants[0] : undefined;

  const price = Number(
    product.price ?? primaryVariant?.price ?? product.starting_at ?? 0,
  );

  const oldPrice = Number(product.oldPrice ?? 0);
  const hasDiscount = oldPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const productName = product.name;
  const categoryName =
    product.category?.name ||
    product.brand?.name ||
    t("store", "Store");

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    }).format(amount);

  const actionButtonClass =
    "flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text-secondary shadow-md transition-colors duration-200 hover:bg-surface-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const linkClass =
    "transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      {/* Product image */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
        {mainImage ? (
          <img
            src={mainImage}
            alt={productName}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-text-muted"
            aria-label={t("imageUnavailable", "Image unavailable")}
          >
            <ShoppingBag className="h-10 w-10" />
          </div>
        )}

        {/* Badges */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            {product.is_featured && (
              <span className="rounded-card bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                {t("featured", "Featured")}
              </span>
            )}

            {hasDiscount && (
              <span className="rounded-card bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="pointer-events-auto flex flex-col gap-2 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`${actionButtonClass} ${
                  isWishlisted
                    ? "text-rose-600 dark:text-rose-400"
                    : ""
                }`}
                title={
                  isWishlisted
                    ? t("removeFromWishlist", "Remove from wishlist")
                    : t("addToWishlist", "Add to wishlist")
                }
                aria-label={
                  isWishlisted
                    ? t("removeFromWishlist", "Remove from wishlist")
                    : t("addToWishlist", "Add to wishlist")
                }
                aria-pressed={isWishlisted}
              >
                <Heart
                  className="h-4 w-4"
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            )}

            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className={actionButtonClass}
                title={t("quickView", "Quick view")}
                aria-label={t("quickView", "Quick view")}
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Category and rating */}
          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-text-muted font-medium">
            <span className="min-w-0 truncate">{categoryName}</span>

            {product.rating != null && Number(product.rating) > 0 && (
              <div
                className="flex shrink-0 items-center gap-1 font-semibold text-text-primary"
                aria-label={t("rating", {
                  defaultValue: "Rating: {{rating}}",
                  rating: Number(product.rating).toFixed(1),
                })}
              >
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />

                <span>{Number(product.rating).toFixed(1)}</span>

                {product.reviewsCount != null &&
                  Number(product.reviewsCount) > 0 && (
                    <span className="text-text-muted">
                      ({product.reviewsCount})
                    </span>
                  )}
              </div>
            )}
          </div>

          {/* Product name */}
          <Link
            to={`/products/${product.slug}`}
            className={`line-clamp-2 text-sm font-bold text-text-primary ${linkClass}`}
          >
            {productName}
          </Link>
        </div>

        {/* Price and add to cart */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="flex min-w-0 flex-col">
            {hasDiscount && (
              <span className="text-xs text-text-muted line-through font-medium">
                {formatPrice(oldPrice)}
              </span>
            )}

            <span className="text-base font-bold text-primary">
              {formatPrice(price)}
            </span>
          </div>

          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product, primaryVariant)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-card bg-primary px-3.5 py-2 text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary shadow-xs"
              aria-label={t("addToCart", "Add to cart")}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{t("add", "Add")}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};