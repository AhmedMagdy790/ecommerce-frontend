// src/pages/ProductDetails/ProductPage.tsx

import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductDescription from "./components/ProductDescription";
import ProductReviews from "./components/ProductReviews";
import RelatedProducts from "./components/RelatedProducts";
import { useParams } from "react-router-dom";
import { useProduct } from "./hooks/useProduct";
import { mapProductDetails } from "../../features/product/adapters/productDetailsAdapter";
import { useLang } from "@/shared/context/LanguageContext";
import { useMemo } from "react";
import { Loader2, AlertCircle, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isRTL } = useLang();

  const {
    data,
    isLoading,
    error,
  } = useProduct(slug);

  const productData = useMemo(() => {
    if (!data) return null;
    return mapProductDetails(
      data?.product,
      lang
    );
  }, [data, lang]);


  // Invalid Slug State
  if (!slug) {
    return (
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-[60vh] flex flex-col items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-16)] text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-3xl)] bg-red-500/10 text-red-600 dark:text-red-400 mb-[var(--spacing-4)] border border-red-500/20">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] mb-[var(--spacing-2)]">
          {lang === "ar" ? "منتج غير صالح" : "Invalid Product"}
        </h1>
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-[var(--spacing-6)] max-w-md">
          {lang === "ar" ? "رابط المنتج المطلوب غير صحيح أو غير متوفر حالياً." : "The requested product link is invalid or currently unavailable."}
        </p>
        <a
          href="/shop"
          className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-6)] py-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-[var(--text-sm)] font-[var(--font-semibold)] shadow-md transition-all hover:opacity-90"
        >
          <span>{lang === "ar" ? "العودة إلى المتجر" : "Back to Shop"}</span>
          {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </a>
      </main>
    );
  }

  // Loading State with Cinematic Skeleton Effect
  if (isLoading) {
    return (
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-[70vh] flex flex-col items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-16)]"
      >
        <div className="flex flex-col items-center gap-[var(--spacing-4)]">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
          <p 
            className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-secondary)] animate-pulse"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {lang === "ar" ? "جاري تحميل تفاصيل المنتج..." : "Loading product details..."}
          </p>
        </div>
      </main>
    );
  }

  // Error or Not Found State
  if (error || !productData) {
    return (
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-[60vh] flex flex-col items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-16)] text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-3xl)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] mb-[var(--spacing-4)] border border-[var(--color-border)]">
          <ShoppingBag size={32} />
        </div>
        <h1 
          className="text-[var(--text-2xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] mb-[var(--spacing-2)]"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {lang === "ar" ? "لم يتم العثور على المنتج" : "Product Not Found"}
        </h1>
        <p 
          className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-[var(--spacing-6)] max-w-md"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {lang === "ar" ? "عذراً، لم نتمكن من العثور على المنتج المطلوب. قد يكون قد تم حذفه أو غير متوفر." : "Sorry, we couldn't find the product you're looking for. It might have been removed or is unavailable."}
        </p>
        <a
          href="/shop"
          className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-6)] py-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-[var(--text-sm)] font-[var(--font-semibold)] shadow-md transition-all hover:opacity-90"
        >
          <span>{lang === "ar" ? "تصفح المنتجات الأخرى" : "Browse Other Products"}</span>
          {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </a>
      </main>
    );
  }

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full px-[var(--spacing-4)] sm:px-[var(--spacing-6)] lg:px-[var(--spacing-8)] py-[var(--spacing-12)] bg-[var(--color-background)]"
    >
      <div className="mx-auto max-w-[var(--container-2xl)]">

        {/* Breadcrumb Navigation Trail */}
        <nav aria-label="Breadcrumb" className="mb-[var(--spacing-8)] flex items-center gap-[var(--spacing-2)] text-[var(--text-xs)] text-[var(--color-text-muted)]">
          <a href="/" className="hover:text-[var(--color-primary)] transition-colors">
            {lang === "ar" ? "الرئيسية" : "Home"}
          </a>
          <span>/</span>
          <a href="/shop" className="hover:text-[var(--color-primary)] transition-colors">
            {lang === "ar" ? "المتجر" : "Shop"}
          </a>
          <span>/</span>
          <span className="text-[var(--color-text-primary)] font-[var(--font-medium)] truncate max-w-[200px]">
            {typeof productData.name === "string" ? productData.name : (productData.name?.[lang as keyof typeof productData.name] || productData.name?.en || "Product")}
          </span>
        </nav>

        {/* Main Product Layout (Gallery & Information) */}
        <section className="grid gap-[var(--spacing-10)] lg:grid-cols-2 items-start">
          <ProductGallery
            data={productData.gallery}
          />

          <ProductInfo data={productData} />
        </section>

        {/* Description & Technical Specifications */}
        <ProductDescription
          data={{
            description: productData.description,
            details: productData.details,
          }}
        />

        {/* Customer Reviews Section */}
        <ProductReviews
          data={{
            reviews: productData.reviews,
            averageRating: productData.averageRating,
            totalReviews: productData.totalReviews,
          }}
        />

        {/* Related Products Section */}
        <RelatedProducts
          data={{
            title: productData.relatedTitle,
            products: productData.relatedProducts,
          }}
        />

      </div>
    </main>
  );
}