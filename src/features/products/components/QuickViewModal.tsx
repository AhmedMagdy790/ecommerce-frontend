import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, ShoppingBag, Heart, Star, Check } from "lucide-react";

import type { Product } from "@/features/product/model/types/product.types";
import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";

interface QuickViewModalProps {
  product: Product<string> | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (
    product: Product<string>,
    variant?: ProductVariant<string>,
    quantity?: number,
  ) => void;
  onToggleWishlist?: (product: Product<string>) => void;
  isWishlisted?: boolean;
}

interface SelectionState {
  productId: Product<string>["id"] | null;
  variant: ProductVariant<string> | undefined;
  quantity: number;
  imageIndex: number;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const { t, i18n } = useTranslation("quickView");

  const isArabic = (i18n.resolvedLanguage ?? i18n.language)
    .toLowerCase()
    .startsWith("ar");

  const locale = isArabic ? "ar-EG" : "en-US";

  const [selection, setSelection] = useState<SelectionState>({
    productId: null,
    variant: undefined,
    quantity: 1,
    imageIndex: 0,
  });

  const variants: ProductVariant<string>[] = Array.isArray(product?.variants)
    ? product.variants
    : [];

  const isCurrentProduct =
    product !== null && selection.productId === product.id;

  const selectedVariant = isCurrentProduct
    ? selection.variant
    : variants[0];

  const quantity = isCurrentProduct ? selection.quantity : 1;
  const activeImageIndex = isCurrentProduct ? selection.imageIndex : 0;

  const updateSelection = (
    updates: Partial<Omit<SelectionState, "productId">>,
  ) => {
    if (!product) return;

    setSelection((current) => {
      const sameProduct = current.productId === product.id;

      return {
        productId: product.id,
        variant: sameProduct ? current.variant : variants[0],
        quantity: sameProduct ? current.quantity : 1,
        imageIndex: sameProduct ? current.imageIndex : 0,
        ...updates,
      };
    });
  };

  // Escape key and body scroll lock.
  useEffect(() => {
    if (!isOpen || !product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, product, onClose]);

  if (!isOpen || !product) return null;

  const imagesList: string[] = [];

  if (product.image) imagesList.push(product.image);

  if (product.thumbnail && !imagesList.includes(product.thumbnail)) {
    imagesList.push(product.thumbnail);
  }

  if (Array.isArray(product.media)) {
    product.media.forEach((item) => {
      const url = item.preview_url;

      if (url && !imagesList.includes(url)) {
        imagesList.push(url);
      }
    });
  }

  if (imagesList.length === 0) {
    imagesList.push("/placeholder-product.png");
  }

  const currentImage =
    imagesList[activeImageIndex] ?? imagesList[0];

  const price = Number(
    selectedVariant?.price ??
      product.price ??
      product.starting_at ??
      0,
  );

  const oldPrice = Number(product.oldPrice ?? 0);
  const hasDiscount = oldPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const productName = product.name;

  const categoryName =
    product.category?.name ??
    product.brand?.name ??
    t("store", "Store");

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    }).format(amount);

  const actionButtonClass =
    "inline-flex items-center justify-center rounded-control border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-5"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t("close", "Close")}
        className="fixed inset-0 cursor-default bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative z-[101] my-auto w-full max-w-4xl overflow-hidden rounded-panel border border-border bg-surface shadow-xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close", "Close")}
          className={`absolute top-3 z-10 h-10 w-10 ${isArabic ? "left-3" : "right-3"} ${actionButtonClass}`}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery */}
          <div className="flex min-w-0 flex-col bg-surface-secondary p-4 sm:p-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-panel bg-surface">
              <img
                src={currentImage}
                alt={productName}
                className="h-full w-full object-cover"
              />

              {hasDiscount && (
                <span className="absolute start-3 top-3 rounded-control bg-error px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            {imagesList.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {imagesList.map((imgUrl, index) => {
                  const isSelected = activeImageIndex === index;

                  return (
                    <button
                      key={`${imgUrl}-${index}`}
                      type="button"
                      onClick={() => updateSelection({ imageIndex: index })}
                      aria-label={t("selectImage", {
                        defaultValue: "Select image {{number}}",
                        number: index + 1,
                      })}
                      aria-pressed={isSelected}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-control border-2 transition-opacity ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="flex min-w-0 flex-col justify-between gap-6 p-5 sm:p-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pe-10 text-xs text-text-muted">
                <span>{categoryName}</span>

                {product.rating != null &&
                  Number(product.rating) > 0 && (
                    <div className="flex items-center gap-1 font-medium text-text-primary">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
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

              <h2
                id="quick-view-title"
                className="mt-3 text-xl font-bold leading-relaxed text-text-primary"
              >
                {productName}
              </h2>

              {/* Price */}
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(price)}
                </span>

                {hasDiscount && (
                  <span className="text-sm text-text-muted line-through">
                    {formatPrice(oldPrice)}
                  </span>
                )}
              </div>

              {/* Variants */}
              {variants.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {t("availableOptions", "Available options")}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {variants.map((variant) => {
                      const isSelected =
                        selectedVariant?.id === variant.id;

                      const variantLabel =
                        variant.sku ||
                        t("optionNumber", {
                          defaultValue: "Option #{{id}}",
                          id: variant.id,
                        });

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() =>
                            updateSelection({ variant })
                          }
                          aria-pressed={isSelected}
                          className={`inline-flex items-center gap-1.5 rounded-control border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          <span>{variantLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-5 border-t border-border pt-4">
                <label
                  htmlFor="quick-view-quantity"
                  className="text-sm font-semibold text-text-primary"
                >
                  {t("quantity", "Quantity")}
                </label>

                <div className="mt-3 inline-flex items-center rounded-control border border-border bg-surface">
                  <button
                    type="button"
                    onClick={() =>
                      updateSelection({
                        quantity: Math.max(1, quantity - 1),
                      })
                    }
                    disabled={quantity <= 1}
                    aria-label={t("decreaseQuantity", "Decrease quantity")}
                    className="px-3 py-2 text-text-secondary transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <span
                    id="quick-view-quantity"
                    aria-live="polite"
                    className="min-w-10 text-center text-sm font-semibold text-text-primary"
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateSelection({ quantity: quantity + 1 })
                    }
                    aria-label={t("increaseQuantity", "Increase quantity")}
                    className="px-3 py-2 text-text-secondary transition-colors hover:text-text-primary"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, selectedVariant, quantity);
                      onClose();
                    }}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{t("addToCart", "Add to cart")}</span>
                  </button>
                )}

                {onToggleWishlist && (
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    aria-label={
                      isWishlisted
                        ? t("removeFromWishlist", "Remove from wishlist")
                        : t("addToWishlist", "Add to wishlist")
                    }
                    aria-pressed={isWishlisted}
                    className={`${actionButtonClass} h-11 w-11 shrink-0 ${
                      isWishlisted ? "text-error" : ""
                    }`}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>
                )}
              </div>

              <Link
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="block rounded-control py-2 text-center text-sm font-medium text-primary transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("viewDetails", "View all details and specifications")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};