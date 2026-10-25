import React from "react";
import { PackageSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ProductCard } from "./ProductCard";
import type { Product } from "@/features/product/model/types/product.types";
import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";

interface ProductGridProps {
  products?: Product<string>[];
  isLoading?: boolean;
  skeletonCount?: number;
  onAddToCart?: (
    product: Product<string>,
    variant?: ProductVariant<string>,
  ) => void;
  onQuickView?: (product: Product<string>) => void;
  onToggleWishlist?: (product: Product<string>) => void;
  wishlistIds?: (number | string)[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  isLoading = false,
  skeletonCount = 8,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistIds = [],
  emptyTitle,
  emptyDescription,
}) => {
  const { t } = useTranslation("productGrid");

  const gridClass =
    "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={gridClass}
        aria-busy="true"
        aria-label={t("loading", "Loading products")}
      >
        {Array.from({
          length: Math.max(0, Math.floor(skeletonCount)),
        }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse flex-col overflow-hidden rounded-panel border border-border bg-surface"
            aria-hidden="true"
          >
            {/* Image skeleton */}
            <div className="aspect-square w-full bg-surface-secondary" />

            {/* Content skeleton */}
            <div className="flex flex-1 flex-col justify-between gap-4 p-4">
              <div className="space-y-3">
                <div className="h-3 w-1/3 rounded-control bg-surface-secondary" />
                <div className="h-4 w-3/4 rounded-control bg-surface-secondary" />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="h-5 w-1/2 rounded-control bg-surface-secondary" />
                <div className="h-8 w-20 rounded-control bg-surface-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <section
        className="flex flex-col items-center justify-center rounded-panel border border-dashed border-border bg-surface px-6 py-12 text-center sm:py-16"
        role="status"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
          <PackageSearch className="h-8 w-8" aria-hidden="true" />
        </div>

        <h3 className="text-lg font-bold text-text-primary">
          {emptyTitle ?? t("empty.title", "No products found")}
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
          {emptyDescription ??
            t(
              "empty.description",
              "We couldn't find any products matching your current filters.",
            )}
        </p>
      </section>
    );
  }

  // Product grid
  return (
    <div className={gridClass}>
      {products.map((product) => {
        const isWishlisted = wishlistIds.some(
          (id) => String(id) === String(product.id),
        );

        return (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={isWishlisted}
          />
        );
      })}
    </div>
  );
};