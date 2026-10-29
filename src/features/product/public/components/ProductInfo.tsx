// src/pages/ProductDetails/components/ProductInfo.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, RotateCcw, Truck } from "lucide-react";
import AddToCart from "./AddToCart";
import { useLang } from "@/shared/context/LanguageContext";
import { useCart } from "@/pages/Cart/hook/useCart";
import type { ProductDetails } from "../../adapters/productDetailsAdapter";

interface ProductInfoProps {
  data: ProductDetails;
}

export default function ProductInfo({ data: product }: ProductInfoProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  const variantsList = product.variants.list;


  const availableSizes = product.variants.sizes;
  const availableColors = product.variants.colors;

  const [selectedSize, setSelectedSize] = useState(
    availableSizes[0] ?? "",
  );
  const [selectedColor, setSelectedColor] = useState(
    availableColors[0] ?? "",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const selectedVariant = variantsList.find((variant) => {
    const attributes = variant.attributes;

    return (
      variant.status === "active" &&
      variant.is_available &&
      (availableSizes.length === 0 ||
        attributes?.size === selectedSize) &&
      (availableColors.length === 0 ||
        attributes?.color === selectedColor)
    );
  });

  const displayPrice =
    selectedVariant?.price ??
    product.starting_at ??
    product.price ??
    null;

  const stock = selectedVariant
    ? Math.max(0, Number(selectedVariant.inventory?.available_stock ?? 0))
    : 0;

  const isStockAvailable = stock > 0;

  const { addToCart } = useCart();

  const handleAddToCart = async (payload: { productId: string | number; quantity: number; variants?: { size?: string; color?: string } }) => {
    if (availableSizes.length > 0 && !selectedSize) {
      setErrorMessage(t("errors.selectSize", { defaultValue: lang === "ar" ? "يرجى اختيار المقاس المناسب" : "Please select a size" }));
      return;
    }
    if (availableColors.length > 0 && !selectedColor) {
      setErrorMessage(t("errors.selectColor", { defaultValue: lang === "ar" ? "يرجى اختيار اللون المناسب" : "Please select a color" }));
      return;
    }


    if (!selectedVariant) {
      setErrorMessage(
        lang === "ar"
          ? "يرجى اختيار نسخة متاحة من المنتج"
          : "Please select an available product variant",
      );
      return;
    }

    await addToCart({
      product_variant_id: selectedVariant.id,
      quantity: payload.quantity,
    });
  };


  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col w-full">

      {/* Category / Brand Eyebrow Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20" 
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("badges.authentic", { defaultValue: lang === "ar" ? "منتج أصلي مضمون" : "100% Authentic Product" })}
        </span>
      </div>

      {/* Product Name */}
      <h1 
        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4 leading-[1.15]"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {product.name}
      </h1>


      {/* Price Section */}
      <div className="mt-6 flex items-baseline gap-4">
        {displayPrice != null && (
          <span className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            ${displayPrice}
          </span>
        )}

        {product.oldPrice && (
          <span className="text-lg font-normal text-text-muted line-through">
            ${product.oldPrice}
          </span>
        )}

        {product.oldPrice && (
          <span className="px-2 py-0.5 rounded-control bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold">
            {t("badges.sale", {
              defaultValue: lang === "ar" ? "تخفيض خاص" : "Sale",
            })}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product?.description && (
        <p 
          className="mt-6 text-base text-text-secondary leading-relaxed"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {product.description}
        </p>
      )}

      {/* Sizes Variant Selector */}
      {availableSizes.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 
              className="text-sm font-semibold text-text-primary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("variants.size", { defaultValue: lang === "ar" ? "المقاس" : "Size" })}: <span className="text-primary font-bold">{selectedSize || t("variants.selectSize", { defaultValue: lang === "ar" ? "اختر المقاس" : "Select size" })}</span>
            </h3>
            <button type="button" className="text-xs text-text-muted underline hover:text-primary">
              {t("variants.sizeGuide", { defaultValue: lang === "ar" ? "دليل المقاسات" : "Size Guide" })}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setErrorMessage(null);
                  }}
                  className={`min-w-12 h-12 px-4 rounded-card text-sm font-semibold transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] ${
                    isSelected
                      ? "border border-primary bg-primary text-text-inverse shadow-md scale-105"
                      : "border border-border bg-surface text-text-primary hover:border-border-hover hover:bg-surface-secondary"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors Variant Selector */}
      {availableColors.length > 0 && (
        <div className="mt-6">
          <h3 
            className="text-sm font-semibold text-text-primary mb-3"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {t("variants.color", { defaultValue: lang === "ar" ? "اللون" : "Color" })}: <span className="text-primary font-bold">{selectedColor || t("variants.selectColor", { defaultValue: lang === "ar" ? "اختر اللون" : "Select color" })}</span>
          </h3>

          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setErrorMessage(null);
                  }}
                  className={`px-5 py-2.5 rounded-card text-sm font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] ${
                    isSelected
                      ? "border border-primary bg-primary text-text-inverse shadow-md scale-105"
                      : "border border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Message for Unselected Variants */}
      {errorMessage && (
        <div className="mt-4 p-3 rounded-card bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold animate-shake">
          {errorMessage}
        </div>
      )}

      {/* Add To Cart Component */}
      <AddToCart
        productId={String(product.id)}
        stock={isStockAvailable}
        maxStock={stock}
        variants={{
          size: selectedSize,
          color: selectedColor,
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Perks and Trust Badges */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-panel bg-surface-secondary border border-border">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary">
              {t("perks.fastDelivery.title", { defaultValue: lang === "ar" ? "شحن سريع" : "Fast Delivery" })}
            </h4>
            <p className="text-xs text-text-secondary">
              {t("perks.fastDelivery.subtitle", { defaultValue: lang === "ar" ? "خلال 2-4 أيام عمل" : "Within 2-4 business days" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-panel bg-surface-secondary border border-border">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary">
              {t("perks.qualityGuarantee.title", { defaultValue: lang === "ar" ? "ضمان الجودة" : "Quality Guarantee" })}
            </h4>
            <p className="text-xs text-text-secondary">
              {t("perks.qualityGuarantee.subtitle", { defaultValue: lang === "ar" ? "منتج أصلي 100%" : "100% Genuine item" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-panel bg-surface-secondary border border-border">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <RotateCcw size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary">
              {t("perks.easyReturns.title", { defaultValue: lang === "ar" ? "إرجاع سهل" : "Easy Returns" })}
            </h4>
            <p className="text-xs text-text-secondary">
              {t("perks.easyReturns.subtitle", { defaultValue: lang === "ar" ? "خلال 14 يوم مجاناً" : "Free within 14 days" })}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}