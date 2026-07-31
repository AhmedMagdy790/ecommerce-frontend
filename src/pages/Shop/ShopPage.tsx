import { useState } from "react";
import ShopHero from "./components/ShopHero";
import ProductGrid from "./components/ProductGrid";

import { useLang } from "@/shared/context/LanguageContext";
import { mapProductCard } from "@/features/product/adapters/productCardAdapter";
import { useProducts } from "@/features/product/hook/useProducts";
import { Loader2, AlertCircle } from "lucide-react";
import ShopFilters from "./components/ShopFilters/ShopFilters";

export default function ShopPage() {
  const { isRTL, lang } = useLang();

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });

  const {
    data,
    isLoading,
    error,
  } = useProducts({
    categories: selectedCategories,
    min_price: priceRange.min,
    max_price: priceRange.max,
  });

  const rawProductsList = data?.list ?? [];

  // Extract unique categories dynamically 
  const categories = Array.from(
    new Map(
      rawProductsList
        .filter((p) => p.category)
        .map((p) => [p.category.id, p.category])
    ).values()
  );

  // Loading State
  if (isLoading) {
    return (
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 bg-[var(--color-background)]"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
          <p 
            className="text-sm font-medium text-[var(--color-text-secondary)] animate-pulse"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {lang === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}
          </p>
        </div>
      </main>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 text-center bg-[var(--color-background)]"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-600 dark:text-red-400 mb-4 border border-red-500/20">
          <AlertCircle size={32} />
        </div>
        <h1 
          className="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {lang === "ar" ? "تعذر تحميل المنتجات" : "Failed to Load Products"}
        </h1>
        <p 
          className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {lang === "ar" ? "حدث خطأ أثناء جلب المنتجات. يرجى التحقق من اتصالك والمحاولة مرة أخرى." : "An error occurred while fetching products. Please check your connection and try again."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-sm font-semibold shadow-md transition-all hover:opacity-90 cursor-pointer"
        >
          <span>{lang === "ar" ? "إعادة المحاولة" : "Try Again"}</span>
        </button>
      </main>
    );
  }

  // Map products for the grid component
  const products = rawProductsList.map((product) =>
    mapProductCard(product, lang)
  );

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="w-full bg-[var(--color-background)] min-h-screen">
      <ShopHero 
        data={{
          title: lang === "ar" ? "تشكيلة المنتجات" : "Shop Collection",
          description: lang === "ar" ? "تصفح أحدث وأرقى المنتجات المتاحة لدينا بأسعار تنافسية." : "Explore our latest and finest products available at competitive prices."
        }} 
      />

      <section className="mx-auto max-w-[var(--container-2xl)] px-4 py-12 sm:px-6 lg:px-8">
        <ShopFilters
          data={{
            categories,
            price: { min: 0, max: 1000 },
          }}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onReset={() => {
            setSelectedCategories([]);
            setPriceRange({ min: "", max: "" });
          }}
        />

        <ProductGrid products={products} />
      </section>
    </main>
  );
}