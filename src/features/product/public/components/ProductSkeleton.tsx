// src/features/product/components/ProductSkeleton.tsx

import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

export default function ProductSkeleton() {
  const { isRTL } = useLang();

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full py-12 bg-[var(--background)] animate-pulse"
    >
      <Container>

        {/* Breadcrumb Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-4 w-12 bg-surface-secondary rounded-control" />
          <span className="text-text-muted">/</span>
          <div className="h-4 w-16 bg-surface-secondary rounded-control" />
          <span className="text-text-muted">/</span>
          <div className="h-4 w-32 bg-surface-secondary rounded-control" />
        </div>

        {/* Main Product Layout (Gallery & Information) */}
        <section className="grid gap-10 lg:grid-cols-2 items-start mb-16">
          
          {/* Gallery Skeleton */}
          <div className="flex flex-col gap-4">
            {/* Main Image Skeleton */}
            <div className="w-full aspect-square bg-surface-secondary rounded-[var(--radius-2xl)]" />
            {/* Thumbnails Skeleton */}
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-surface-secondary rounded-[var(--radius-lg)]" />
              <div className="w-20 h-20 bg-surface-secondary rounded-[var(--radius-lg)]" />
              <div className="w-20 h-20 bg-surface-secondary rounded-[var(--radius-lg)]" />
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col gap-6">
            {/* Category / Brand badge */}
            <div className="h-5 w-24 bg-surface-secondary rounded-full" />
            
            {/* Product Title */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-surface-secondary rounded-card" />
              <div className="h-8 w-3/4 bg-surface-secondary rounded-card" />
            </div>

            {/* Price */}
            <div className="h-10 w-32 bg-surface-secondary rounded-xl my-2" />

            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-surface-secondary rounded-control" />
              <div className="h-4 w-full bg-surface-secondary rounded-control" />
              <div className="h-4 w-2/3 bg-surface-secondary rounded-control" />
            </div>

            <hr className="border-border my-2" />

            {/* Variants Selector Skeleton (Colors / Sizes) */}
            <div className="space-y-4">
              <div className="h-4 w-20 bg-surface-secondary rounded-control" />
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-secondary" />
                <div className="w-10 h-10 rounded-full bg-surface-secondary" />
                <div className="w-10 h-10 rounded-full bg-surface-secondary" />
              </div>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="h-14 w-full bg-surface-secondary rounded-2xl mt-4" />
          </div>

        </section>

      </Container>
    </main>
  );
}