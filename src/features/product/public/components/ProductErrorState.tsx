// src/features/product/components/ProductErrorState.tsx

import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { ShoppingBag, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Container } from "@/shared/components/layout/Container";

interface ProductErrorStateProps {
  onRetry?: () => void; // اختياري: زر لإعادة محاولة جلب البيانات
}

export default function ProductErrorState({ onRetry }: ProductErrorStateProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-[60vh] flex flex-col items-center justify-center py-16 bg-background text-center"
    >
      <Container className="flex flex-col items-center justify-center">
        {/* Icon Wrapper */}
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-2xl)] bg-surface-secondary text-text-muted mb-4 border border-border shadow-xs">
          <ShoppingBag size={32} />
        </div>

        {/* Title */}
        <h1 
          className="text-2xl font-bold text-text-primary mb-2"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("product.notFound", "Product Not Found")}
        </h1>

        {/* Description */}
        <p 
          className="text-sm text-text-secondary mb-6 max-w-md leading-relaxed"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("product.notFoundDesc", "Sorry, we couldn't find the product you're looking for. It might have been removed or is unavailable.")}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-card bg-surface-secondary text-text-primary text-sm font-semibold border border-border transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RefreshCw size={16} />
              <span>{t("product.retry", "Try Again")}</span>
            </button>
          )}

          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-card app-button-primary text-sm font-semibold shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>{t("product.browseOther", "Browse Other Products")}</span>
            {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </a>
        </div>
      </Container>
    </main>
  );
}