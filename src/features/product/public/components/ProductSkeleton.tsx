// src/features/product/components/ProductSkeleton.tsx

import { useLang } from "@/shared/context/LanguageContext";

export default function ProductSkeleton() {
  const { isRTL } = useLang();

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full px-[var(--spacing-4)] sm:px-[var(--spacing-6)] lg:px-[var(--spacing-8)] py-[var(--spacing-12)] bg-[var(--color-background)] animate-pulse"
    >
      <div className="mx-auto max-w-[var(--container-2xl)]">

        {/* Breadcrumb Skeleton */}
        <div className="mb-[var(--spacing-8)] flex items-center gap-[var(--spacing-2)]">
          <div className="h-4 w-12 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)]" />
          <span className="text-[var(--color-text-muted)]">/</span>
          <div className="h-4 w-16 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)]" />
          <span className="text-[var(--color-text-muted)]">/</span>
          <div className="h-4 w-32 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)]" />
        </div>

        {/* Main Product Layout (Gallery & Information) */}
        <section className="grid gap-[var(--spacing-10)] lg:grid-cols-2 items-start mb-[var(--spacing-16)]">
          
          {/* Gallery Skeleton */}
          <div className="flex flex-col gap-[var(--spacing-4)]">
            {/* Main Image Skeleton */}
            <div className="w-full aspect-square bg-[var(--color-surface-secondary)] rounded-[var(--radius-3xl)]" />
            {/* Thumbnails Skeleton */}
            <div className="flex gap-[var(--spacing-3)]">
              <div className="w-20 h-20 bg-[var(--color-surface-secondary)] rounded-[var(--radius-xl)]" />
              <div className="w-20 h-20 bg-[var(--color-surface-secondary)] rounded-[var(--radius-xl)]" />
              <div className="w-20 h-20 bg-[var(--color-surface-secondary)] rounded-[var(--radius-xl)]" />
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col gap-[var(--spacing-6)]">
            {/* Category / Brand badge */}
            <div className="h-5 w-24 bg-[var(--color-surface-secondary)] rounded-full" />
            
            {/* Product Title */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)]" />
              <div className="h-8 w-3/4 bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)]" />
            </div>

            {/* Price */}
            <div className="h-10 w-32 bg-[var(--color-surface-secondary)] rounded-[var(--radius-xl)] my-[var(--spacing-2)]" />

            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)]" />
              <div className="h-4 w-full bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)]" />
              <div className="h-4 w-2/3 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)]" />
            </div>

            <hr className="border-[var(--color-border)] my-[var(--spacing-2)]" />

            {/* Variants Selector Skeleton (Colors / Sizes) */}
            <div className="space-y-4">
              <div className="h-4 w-20 bg-[var(--color-surface-secondary)] rounded-[var(--radius-md)]" />
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-secondary)]" />
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-secondary)]" />
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-secondary)]" />
              </div>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="h-14 w-full bg-[var(--color-surface-secondary)] rounded-[var(--radius-2xl)] mt-[var(--spacing-4)]" />
          </div>

        </section>

      </div>
    </main>
  );
}