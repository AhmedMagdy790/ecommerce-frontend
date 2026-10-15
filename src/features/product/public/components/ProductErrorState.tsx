// src/features/product/components/ProductErrorState.tsx

import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { ShoppingBag, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";

interface ProductErrorStateProps {
  onRetry?: () => void; // اختياري: زر لإعادة محاولة جلب البيانات
}

export default function ProductErrorState({ onRetry }: ProductErrorStateProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-[60vh] flex flex-col items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-16)] text-center bg-[var(--color-background)]"
    >
      {/* Icon Wrapper */}
      <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-3xl)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] mb-[var(--spacing-4)] border border-[var(--color-border)] shadow-sm">
        <ShoppingBag size={32} />
      </div>

      {/* Title */}
      <h1 
        className="text-[var(--text-2xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] mb-[var(--spacing-2)]"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {t("product.notFound", "Product Not Found")}
      </h1>

      {/* Description */}
      <p 
        className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-[var(--spacing-6)] max-w-md leading-relaxed"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {t("product.notFoundDesc", "Sorry, we couldn't find the product you're looking for. It might have been removed or is unavailable.")}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-3)]">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-5)] py-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] text-[var(--text-sm)] font-[var(--font-semibold)] border border-[var(--color-border)] transition-all hover:bg-[var(--color-surface-hover)]"
          >
            <RefreshCw size={16} />
            <span>{t("product.retry", "Try Again")}</span>
          </button>
        )}

        <a
          href="/shop"
          className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-6)] py-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-[var(--text-sm)] font-[var(--font-semibold)] shadow-md transition-all hover:opacity-90"
        >
          <span>{t("product.browseOther", "Browse Other Products")}</span>
          {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </a>
      </div>
    </main>
  );
}