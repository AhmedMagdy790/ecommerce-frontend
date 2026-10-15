// src/pages/ProductDetails/components/ProductInfo.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, ShieldCheck, RotateCcw, Truck } from "lucide-react";
import AddToCart from "./AddToCart";
import { useLang } from "@/shared/context/LanguageContext";
import { useCart } from "@/pages/Cart/hook/useCart"; // Import your cart hook
import type { Product } from "../../model/types/product.types";


interface ProductInfoProps {
  data: Product<string>;
}

export default function ProductInfo({ data: product }: ProductInfoProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  const [selectedSize, setSelectedSize] = useState<string>(product.variants?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.variants?.colors?.[0] || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hook into TanStack Query cart mutation
  const { addToCart } = useCart();


  const handleAddToCart = async (payload: { productId: string | number; quantity: number; variants?: { size?: string; color?: string } }) => {
    if (product.variants?.sizes && product.variants.sizes.length > 0 && !selectedSize) {
      setErrorMessage(lang === "ar" ? "يرجى اختيار المقاس المناسب" : "Please select a size");
      return;
    }
    if (product.variants?.colors && product.variants.colors.length > 0 && !selectedColor) {
      setErrorMessage(lang === "ar" ? "يرجى اختيار اللون المناسب" : "Please select a color");
      return;
    }
    
    setErrorMessage(null);
    
    try {
      // NOTE: Your Laravel backend expects `product_variant_id`. 
      // If your product object contains a variant ID map, use it here. 
      // For demonstration, we pass product.id or map it to a variant ID field.
      await addToCart({
        product_variant_id: Number(product.id), // Replace with actual variant ID lookup if applicable
        quantity: payload.quantity,
      });
    } catch (error) {
      console.error("Failed to add item to cart from product page", error);
    }
  };

  const rating = product.rating || 5;
  const reviewsCount = product.reviewsCount || 128;
  const isStockAvailable = typeof product.stock === "number" ? product.stock > 0 : Boolean(product.stock);
  const stock = typeof product.stock === "number" ? product.stock : (product.stock ? 10 : 0);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col w-full">

      {/* Category / Brand Eyebrow Badge */}
      <div className="flex items-center gap-[var(--spacing-2)] mb-[var(--spacing-3)]">
        <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/10 px-[var(--spacing-3)] py-1 rounded-[var(--radius-full)] border border-[var(--color-primary)]/20" style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}>
          {lang === "ar" ? "منتج أصلي مضمون" : "100% Authentic Product"}
        </span>
      </div>

      {/* Product Name */}
      <h1 
        className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] lg:text-[var(--text-5xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)] mb-[var(--spacing-4)] leading-[1.15]"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-[var(--spacing-3)] pb-[var(--spacing-6)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star 
              key={index} 
              size={16} 
              fill={index < Math.floor(rating) ? "currentColor" : "none"} 
              className={index < Math.floor(rating) ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}
            />
          ))}
        </div>
        <span 
          className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {rating} ({reviewsCount} {t("reviews", { defaultValue: lang === "ar" ? "مراجعة" : "reviews" })})
        </span>
      </div>

      {/* Price Section */}
      <div className="mt-[var(--spacing-6)] flex items-baseline gap-[var(--spacing-4)]">
        <span className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] text-[var(--color-primary)] tracking-tight">
          ${product.price}
        </span>
        {product.oldPrice && (
          <span className="text-[var(--text-lg)] font-[var(--font-normal)] text-[var(--color-text-muted)] line-through">
            ${product.oldPrice}
          </span>
        )}
        {product.oldPrice && (
          <span className="px-[var(--spacing-2)] py-0.5 rounded-[var(--radius-md)] bg-red-500/10 text-red-600 dark:text-red-400 text-[var(--text-xs)] font-[var(--font-semibold)]">
            {lang === "ar" ? "تخفيض خاص" : "Sale"}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product?.description && (
        <p 
          className="mt-[var(--spacing-6)] text-[var(--text-base)] text-[var(--color-text-secondary)] leading-relaxed"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {product.description}
        </p>
      )}

      {/* Sizes Variant Selector */}
      {product.variants?.sizes && product.variants.sizes.length > 0 && (
        <div className="mt-[var(--spacing-8)]">
          <div className="flex items-center justify-between mb-[var(--spacing-3)]">
            <h3 
              className="text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("size", { defaultValue: lang === "ar" ? "المقاس" : "Size" })}: <span className="text-[var(--color-primary)] font-bold">{selectedSize || (lang === "ar" ? "اختر المقاس" : "Select size")}</span>
            </h3>
            <button type="button" className="text-xs text-[var(--color-text-muted)] underline hover:text-[var(--color-primary)]">
              {lang === "ar" ? "دليل المقاسات" : "Size Guide"}
            </button>
          </div>

          <div className="flex flex-wrap gap-[var(--spacing-3)]">
            {product.variants.sizes.map((size: string) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setErrorMessage(null);
                  }}
                  className={`min-w-12 h-12 px-[var(--spacing-4)] rounded-[var(--radius-xl)] border text-[var(--text-sm)] font-[var(--font-semibold)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md scale-105"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-secondary)]"
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
      {product.variants?.colors && product.variants.colors.length > 0 && (
        <div className="mt-[var(--spacing-6)]">
          <h3 
            className="text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)] mb-[var(--spacing-3)]"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {t("color", { defaultValue: lang === "ar" ? "اللون" : "Color" })}: <span className="text-[var(--color-primary)] font-bold">{selectedColor || (lang === "ar" ? "اختر اللون" : "Select color")}</span>
          </h3>

          <div className="flex flex-wrap gap-[var(--spacing-3)]">
            {product.variants.colors.map((color: string) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setErrorMessage(null);
                  }}
                  className={`px-[var(--spacing-5)] py-[var(--spacing-2.5)] rounded-[var(--radius-xl)] border text-[var(--text-sm)] font-[var(--font-medium)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md scale-105"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)]"
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
        <div className="mt-4 p-3 rounded-[var(--radius-xl)] bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-[var(--text-xs)] font-[var(--font-semibold)] animate-shake">
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
      <div className="mt-[var(--spacing-8)] grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-4)] pt-[var(--spacing-6)] border-t border-[var(--color-border)]">
        <div className="flex items-center gap-[var(--spacing-3)] p-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-[var(--text-xs)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
              {lang === "ar" ? "شحن سريع" : "Fast Delivery"}
            </h4>
            <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
              {lang === "ar" ? "خلال 2-4 أيام عمل" : "Within 2-4 business days"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[var(--spacing-3)] p-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-[var(--text-xs)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
              {lang === "ar" ? "ضمان الجودة" : "Quality Guarantee"}
            </h4>
            <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
              {lang === "ar" ? "منتج أصلي 100%" : "100% Genuine item"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[var(--spacing-3)] p-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <RotateCcw size={20} />
          </div>
          <div>
            <h4 className="text-[var(--text-xs)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
              {lang === "ar" ? "إرجاع سهل" : "Easy Returns"}
            </h4>
            <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
              {lang === "ar" ? "خلال 14 يوم مجاناً" : "Free within 14 days"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}