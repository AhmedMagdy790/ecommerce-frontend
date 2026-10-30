// src/components/QuickViewModal.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, ShoppingBag, Heart, Check } from "lucide-react";

import { useLang } from "@/shared/context/LanguageContext";
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

type VariantWithInventory = ProductVariant<string> & {
  inventory?: { available_stock?: number } | null;
};

const PLACEHOLDER_IMAGE = "/images/placeholders/product.webp";


export const QuickViewModal: React.FC<QuickViewModalProps> = (props) => {
  const { product, isOpen } = props;

  if (!isOpen || !product) return null;

  return <QuickViewContent key={product.id} {...props} product={product} />;
};


interface QuickViewContentProps extends Omit<QuickViewModalProps, "product"> {
  product: Product<string>;
}

const QuickViewContent: React.FC<QuickViewContentProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const { t } = useTranslation("quickView");
  const { isRTL } = useLang();
  const locale = isRTL ? "ar-EG" : "en-EG";

  const variants = useMemo<VariantWithInventory[]>(
    () =>
      Array.isArray(product.variants)
        ? (product.variants as VariantWithInventory[]).filter(
            (v) => v.status === "active" && v.is_available === true,
          )
        : [],
    [product.variants],
  );

  const [variantId, setVariantId] = useState<number | undefined>(
    variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  const selectedVariant = variants.find((v) => v.id === variantId);

  // أقصى كمية = المخزون المتاح للـ variant المختار (لو الـ API رجّعه)
  const maxQuantity = selectedVariant?.inventory?.available_stock;

  const selectVariant = (variant: VariantWithInventory) => {
    setVariantId(variant.id);
    setQuantity(1);
  };

  const increaseQuantity = () =>
    setQuantity((q) =>
      typeof maxQuantity === "number" ? Math.min(maxQuantity, q + 1) : q + 1,
    );

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  // Escape + قفل scroll الصفحة
  useEffect(() => {
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
  }, [onClose]);

  // الصور: featured + thumbnail + gallery بدون تكرار
  const imagesList = useMemo(() => {
    const urls = [
      product.featured_image,
      product.thumbnail,
      ...(product.gallery?.map((g) => g.url) ?? []),
    ].filter(
      (url): url is string => typeof url === "string" && url.trim().length > 0,
    );

    const unique = [...new Set(urls)];
    return unique.length > 0 ? unique : [PLACEHOLDER_IMAGE];
  }, [product.featured_image, product.thumbnail, product.gallery]);

  const currentImage = imagesList[imageIndex] ?? imagesList[0];

  // السعر
  const rawPrice =
    selectedVariant?.price ?? product.starting_at ?? product.price;

  const parsedPrice =
    rawPrice !== null && rawPrice !== undefined && rawPrice !== ""
      ? Number(rawPrice)
      : null;

  const price =
    parsedPrice !== null && Number.isFinite(parsedPrice) && parsedPrice >= 0
      ? parsedPrice
      : null;

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    }).format(amount);

  const productName = product.name;
  const canAddToCart = Boolean(selectedVariant);

  const actionButtonClass =
    "inline-flex items-center justify-center rounded-control border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const wishlistLabel = isWishlisted
    ? t("removeFromWishlist", "Remove from wishlist")
    : t("addToWishlist", "Add to wishlist");

  return (
    <div
      className="fixed inset-0 z-[99999999] flex items-center justify-center overflow-y-auto p-3 sm:p-5"
      dir={isRTL ? "rtl" : "ltr"}
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
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close", "Close")}
          className={`absolute top-3 z-10 h-10 w-10 ${
            isRTL ? "left-3" : "right-3"
          } ${actionButtonClass}`}
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
            </div>

            {imagesList.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {imagesList.map((imgUrl, index) => {
                  const isSelected = imageIndex === index;

                  return (
                    <button
                      key={`${imgUrl}-${index}`}
                      type="button"
                      onClick={() => setImageIndex(index)}
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

          {/* Details */}
          <div className="flex min-w-0 flex-col justify-between gap-6 p-5 sm:p-7">
            <div>
              {(product.brand?.name || product.category?.name) && (
                <p className="text-xs text-text-muted">
                  {[product.brand?.name, product.category?.name]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              )}

              <h2
                id="quick-view-title"
                className="mt-2 text-xl font-bold leading-relaxed text-text-primary"
              >
                {productName}
              </h2>

              {/* Price */}
              <div className="mt-3">
                {price !== null ? (
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(price)}
                  </span>
                ) : (
                  <span className="text-sm text-text-muted">
                    {t("priceUnavailable", "Price unavailable")}
                  </span>
                )}
              </div>

              {/* Variants */}
              {variants.length > 0 ? (
                <div className="mt-5 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {t("availableOptions", "Available options")}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;

                      const attributesLabel = variant.attributes
                        ? Object.values(variant.attributes).join(" / ")
                        : "";

                      const variantLabel =
                        attributesLabel ||
                        variant.sku ||
                        t("optionNumber", {
                          defaultValue: "Option #{{id}}",
                          id: variant.id,
                        });

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => selectVariant(variant)}
                          aria-pressed={isSelected}
                          className={`inline-flex items-center gap-1.5 rounded-control border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          <span>{variantLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="mt-5 border-t border-border pt-4 text-sm text-text-muted">
                  {t("outOfStock", "Out of stock")}
                </p>
              )}

              {/* Quantity */}
              {canAddToCart && (
                <div className="mt-5 border-t border-border pt-4">
                  <span
                    id="quick-view-quantity-label"
                    className="text-sm me-3 font-semibold text-text-primary"
                  >
                    {t("quantity", "Quantity")}
                  </span>

                  <div
                    role="group"
                    aria-labelledby="quick-view-quantity-label"
                    className="mt-3 inline-flex items-center rounded-control border border-border bg-surface"
                  >
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      aria-label={t("decreaseQuantity", "Decrease quantity")}
                      className="px-3 py-2 text-text-secondary transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <span
                      aria-live="polite"
                      className="min-w-10 text-center text-sm font-semibold text-text-primary"
                    >
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        typeof maxQuantity === "number" &&
                        quantity >= maxQuantity
                      }
                      aria-label={t("increaseQuantity", "Increase quantity")}
                      className="px-3 py-2 text-text-secondary transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {typeof maxQuantity === "number" && (
                    <p className="mt-2 text-xs text-text-muted">
                      {t("availableQuantity", {
                        defaultValue: "{{count}} available",
                        count: maxQuantity,
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                {onAddToCart && (
                  <button
                    type="button"
                    disabled={!canAddToCart}
                    onClick={() => {
                      if (!selectedVariant) return;
                      onAddToCart(product, selectedVariant, quantity);
                      onClose();
                    }}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{t("addToCart", "Add to cart")}</span>
                  </button>
                )}

                {onToggleWishlist && (
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    aria-label={wishlistLabel}
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