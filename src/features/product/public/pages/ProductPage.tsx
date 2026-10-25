// src/pages/ProductDetails/ProductPage.tsx

import { useTranslation } from "react-i18next";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ProductDescription from "../components/ProductDescription";
import ProductReviews from "../components/ProductReviews";
import RelatedProducts from "../components/RelatedProducts";
import { useParams } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import { useMemo } from "react";
import { useProduct } from "../hook/useProduct";
import { mapProductDetails } from "../../adapters/productDetailsAdapter";
import ProductSkeleton from "../components/ProductSkeleton";
import ProductErrorState from "../components/ProductErrorState";
import { Container } from "@/shared/components/layout/Container";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation("product");
  const { isRTL } = useLang();

  // 2. Fetch Product data via React Query
  const {
    data: product,
    isLoading,
    error,
  } = useProduct(slug ?? "");

  // Map product data safely when available
  const productData = useMemo(() => {
    if (!product) return null;
    return mapProductDetails(product);
  }, [product]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  // 4. Error or Not Found State
  if (error || !productData) {
    return <ProductErrorState />;
  }

  // 5. Success State (Render Product Page Content)
  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full py-12 bg-background"
    >
      <Container size="2xl">

        {/* Breadcrumb Navigation Trail */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-text-muted">
          <a href="/" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control">
            {t("nav.home", "Home")}
          </a>
          <span>/</span>
          <a href="/shop" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control">
            {t("nav.shop", "Shop")}
          </a>
          <span>/</span>
          <span className="text-text-primary font-medium truncate max-w-[200px]">
            {productData.name}
          </span>
        </nav>

        {/* Main Product Layout (Gallery & Information) */}
        <section className="grid gap-10 lg:grid-cols-2 items-start">
          <ProductGallery data={productData.gallery} />
          <ProductInfo data={productData} />
        </section>

        {/* Description & Technical Specifications */}
        <ProductDescription
          data={{
            description: productData.description,
          }}
        />

        {/* Customer Reviews Section */}
        <ProductReviews
          data={{
            reviews: productData.reviews,
            averageRating: productData.rating,
            totalReviews: productData.reviewsCount,
          }}
        />

        {/* Related Products Section */}
        <RelatedProducts
          data={{
            title: t("product.relatedProducts", "Related Products"),
            products: productData.relatedProducts,
          }}
        />

      </Container>
    </main>
  );
}