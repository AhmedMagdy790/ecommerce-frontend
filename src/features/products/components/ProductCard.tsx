// src/components/ProductCard.tsx

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Eye, Heart } from "lucide-react";

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

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const { t, i18n } = useTranslation("productCard");

  console.log("", product)
  const locale = i18n.language?.startsWith("ar") ? "ar-EG" : "en-EG";

  const formatPrice = useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    });
    return (amount: number) => formatter.format(amount);
  }, [locale]);

  const {
    primaryVariant,
    inStock,
    hasMultipleVariants,
    price,
    hasPriceRange,
  } = useMemo(() => {
    const variants: ProductVariant<string>[] = Array.isArray(product.variants)
      ? product.variants
      : [];

    const availableVariants = variants
      .filter((v) => v.status === "active" && v.is_available === true)
      .sort(
        (a, b) =>
          (toNumber(a.price) ?? Infinity) - (toNumber(b.price) ?? Infinity),
      );

    const primaryVariant = availableVariants[0];

    const inStock =
      variants.length > 0
        ? availableVariants.length > 0
        : (product as { has_stock?: boolean }).has_stock ?? true;

    const price =
      toNumber(primaryVariant?.price) ??
      toNumber(product.starting_at) ??
      toNumber(product.price);

    const prices = variants
      .map((v) => toNumber(v.price))
      .filter((p): p is number => p !== null);

    const hasPriceRange = prices.length > 1 && Math.min(...prices) !== Math.max(...prices);

    return {
      variants,
      availableVariants,
      primaryVariant,
      inStock,
      hasMultipleVariants: variants.length > 1,
      price,
      hasPriceRange,
    };
  }, [product]);

  const productName = product.name;
  const mainImage = product.thumbnail || product.featured_image;

  const handleAddToCart = () => {
    if (!inStock) return;

    // أكتر من variant: خلّي المستخدم يختار
    if (hasMultipleVariants && onQuickView) {
      onQuickView(product);
      return;
    }

    onAddToCart?.(product, primaryVariant);
  };

  const actionButtonClass =
    "flex h-9 w-9 items-center justify-center rounded-full bg-surface text-text-secondary shadow-md transition-colors duration-200 hover:bg-surface-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const linkClass =
    "transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const wishlistLabel = isWishlisted
    ? t("removeFromWishlist", "Remove from wishlist")
    : t("addToWishlist", "Add to wishlist");

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl ${
        !inStock ? "opacity-90" : ""
      }`}
    >
      {/* Product image */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
        {mainImage ? (
          <img
            src={mainImage}
            alt={productName}
            loading="lazy"
            className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
              !inStock ? "grayscale" : ""
            }`}
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

            {!inStock && (
              <span className="rounded-card bg-neutral-800 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                {t("outOfStock", "Out of stock")}
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
                  isWishlisted ? "text-rose-600 dark:text-rose-400" : ""
                }`}
                title={wishlistLabel}
                aria-label={wishlistLabel}
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
        <div className="space-y-1">
          {(product.brand?.name || product.category?.name) && (
            <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-text-muted">
              {product.brand?.name && (
                <span className="font-medium">{product.brand.name}</span>
              )}
              {product.brand?.name && product.category?.name && (
                <span aria-hidden="true">•</span>
              )}
              {product.category?.name && <span>{product.category.name}</span>}
            </p>
          )}

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
            {price !== null ? (
              <>
                {hasPriceRange && (
                  <span className="text-xs font-medium text-text-muted">
                    {t("startingFrom", "Starting from")}
                  </span>
                )}
                <span className="text-base font-bold text-primary">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-sm text-text-muted">
                {t("priceUnavailable", "Price unavailable")}
              </span>
            )}
          </div>

          {onAddToCart && (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-card bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              aria-label={
                inStock
                  ? t("addToCart", "Add to cart")
                  : t("outOfStock", "Out of stock")
              }
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {!inStock
                  ? t("outOfStock", "Out of stock")
                  : hasMultipleVariants && onQuickView
                    ? t("selectOptions", "Options")
                    : t("add", "Add")}
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};