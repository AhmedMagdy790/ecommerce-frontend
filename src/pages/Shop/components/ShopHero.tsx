// src/pages/Shop/components/ShopHero.tsx

import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface Props {
  data?: {
    title?: string | { ar?: string; en?: string };
    description?: string | { ar?: string; en?: string };
    image?: string;
  };
}

export default function ShopHero({ data }: Props) {
  const { t } = useTranslation("shop");
  const { lang, isRTL } = useLang();

  // Helper to safely resolve title/description from localization strings, objects, or i18n keys
  const getText = (value?: string | { ar?: string; en?: string }) => {
    if (!value) return "";
    if (typeof value === "object") {
      return value[lang as keyof typeof value] || value.en || value.ar || "";
    }
    return t(value, { defaultValue: value });
  };

  const title = getText(data?.title) || t("hero.title", { defaultValue: lang === "ar" ? "متجرنا الإلكتروني" : "Our Online Store" });
  const description = getText(data?.description) || t("hero.description", { defaultValue: lang === "ar" ? "اكتشف تشكيلة واسعة من أفضل المنتجات المصممة خصيصاً لتناسب احتياجاتك." : "Discover a wide selection of the best products tailored specifically to your needs." });
  const heroImage = data?.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8";

  return (
    <div className="mx-auto max-w-[var(--container-2xl)] px-[var(--spacing-4)] sm:px-[var(--spacing-6)] lg:px-[var(--spacing-8)] pt-[var(--spacing-6)]">
      <section 
        dir={isRTL ? "rtl" : "ltr"}
        className="relative w-full h-[380px] sm:h-[440px] overflow-hidden rounded-[var(--radius-3xl)] shadow-[var(--shadow-xl)] border border-[var(--color-border)] group"
      >
        {/* Background Image with Cinematic Scale Animation */}
        <img
          src={heroImage}
          alt={title || "Shop Hero"}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-[var(--ease-default)] group-hover:scale-105"
          loading="eager"
        />

        {/* Advanced Multi-layer Gradient Overlays for Enhanced Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
        <div className={`absolute inset-0 bg-gradient-to-${isRTL ? "l" : "r"} from-black/75 via-black/30 to-transparent`} />

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col justify-center px-[var(--spacing-6)] sm:px-[var(--spacing-12)] lg:px-[var(--spacing-16)] text-white max-w-2xl">
          
          {/* Minimalist Glassmorphic Category Badge */}
          <div className="inline-flex items-center gap-[var(--spacing-2)] w-fit px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg mb-[var(--spacing-5)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <span 
              className="text-[var(--text-xs)] font-[var(--font-semibold)] text-white tracking-widest uppercase"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {lang === "ar" ? "تسوق أحدث المنتجات" : "Explore Our Collection"}
            </span>
          </div>

          <h1 
            className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] lg:text-[var(--text-5xl)] font-[var(--font-bold)] tracking-tight leading-[1.15] mb-[var(--spacing-3)]"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {title}
          </h1>

          {description && (
            <p 
              className="text-[var(--text-sm)] sm:text-[var(--text-base)] font-[var(--font-normal)] text-gray-200 leading-relaxed max-w-lg"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {description}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}