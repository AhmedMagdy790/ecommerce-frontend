// src/pages/ProductDetails/components/ProductDescription.tsx

import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

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
      className="mt-16 border-t border-border pt-10 bg-background"
    >
      <Container>
        {/* Section Title */}
        <h2 
          className="mb-6 text-2xl font-bold tracking-tight text-text-primary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("description.title", { defaultValue: lang === "ar" ? "تفاصيل ووصف المنتج" : "Product Description & Details" })}
        </h2>

        {/* Description Paragraph */}
        {description && (
          <p 
            className="max-w-4xl text-base leading-relaxed text-text-secondary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {description}
          </p>
        )}

        {/* Technical/Specifications Details Grid */}
        {details.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {details.map((item, index) => {
              const detailTitle = getLocalizedText(item.title);
              const detailValue = getLocalizedText(item.value);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-card border border-border bg-surface p-4 shadow-xs transition-colors hover:bg-surface-secondary"
                >
                  <span 
                    className="text-sm font-semibold text-text-primary"
                    style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                  >
                    {detailTitle}
                  </span>

                  <span 
                    className="text-sm font-medium text-text-secondary"
                    style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                  >
                    {detailValue}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}