// src/pages/ProductDetails/components/ProductDescription.tsx

import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface DetailItem {
  title: string | { ar?: string; en?: string };
  value: string | { ar?: string; en?: string };
}

interface ProductDescriptionProps {
  data?: {
    description?: string | { ar?: string; en?: string };
    details?: DetailItem[];
  };
}

export default function ProductDescription({
  data,
}: ProductDescriptionProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  // Helper to safely extract localized text
  const getLocalizedText = (value?: string | { ar?: string; en?: string }) => {
    if (!value) return "";
    if (typeof value === "string") {
      return t(value, { defaultValue: value });
    }
    return value[lang as keyof typeof value] || value.en || value.ar || "";
  };

  const description = getLocalizedText(data?.description);
  const details = data?.details || [];

  if (!description && details.length === 0) {
    return null;
  }

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-[var(--spacing-16)] border-t border-[var(--color-border)] pt-[var(--spacing-10)]"
    >
      {/* Section Title */}
      <h2 
        className="mb-[var(--spacing-6)] text-[var(--text-2xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)]"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {t("description.title", { defaultValue: lang === "ar" ? "تفاصيل ووصف المنتج" : "Product Description & Details" })}
      </h2>

      {/* Description Paragraph */}
      {description && (
        <p 
          className="max-w-4xl text-[var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {description}
        </p>
      )}

      {/* Technical/Specifications Details Grid */}
      {details.length > 0 && (
        <div className="mt-[var(--spacing-8)] grid gap-[var(--spacing-4)] md:grid-cols-2">
          {details.map((item, index) => {
            const detailTitle = getLocalizedText(item.title);
            const detailValue = getLocalizedText(item.value);

            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--spacing-4)] shadow-xs transition-colors hover:bg-[var(--color-surface-secondary)]"
              >
                <span 
                  className="text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {detailTitle}
                </span>

                <span 
                  className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-secondary)]"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {detailValue}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}