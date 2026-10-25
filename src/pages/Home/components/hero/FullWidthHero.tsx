// src/pages/Home/components/sections/FullWidthHero.tsx

import { Link } from "react-router-dom";
import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { normalizeNullable } from "@/shared/utils/normalizeNullable";

interface FullWidthHeroProps {
  section: Section;
}

export function FullWidthHero({ section }: FullWidthHeroProps) {
  const { lang, isRTL, t } = useLang();

  // 1. استخراج العنصر الأول من data بأمان
  const rawData = section?.data;
  const item = Array.isArray(rawData) ? rawData[0] : rawData;

  if (!item) return null;

  // 2. معالجة النصوص سواء كانت String مباشر أو Object متعدد اللغات
  const rawTitle = typeof item.title === "object" ? (item.title?.[lang] ?? item.title?.en) : item.title;
  const rawSubtitle = typeof item.subtitle === "object" ? (item.subtitle?.[lang] ?? item.subtitle?.en) : item.subtitle;

  const title = normalizeNullable(rawTitle);
  const subtitle = normalizeNullable(rawSubtitle);
  const image = normalizeNullable(item.image);
  const link = normalizeNullable(item.link) ?? "/products";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] overflow-hidden bg-surface my-8 group rounded-panel border border-border shadow-xl"
    >
      {/* Background Image with Dynamic Gradient Based on Direction */}
      {image && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={image}
            alt={title || "Full Width Hero"}
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-[var(--ease-default)] group-hover:scale-105"
            loading="eager"
          />
          <div 
            className={`absolute inset-0 ${
              isRTL 
                ? "bg-gradient-to-l from-black/80 via-black/40 to-transparent" 
                : "bg-gradient-to-r from-black/80 via-black/40 to-transparent"
            }`} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-start p-8 sm:p-16 lg:p-20 max-w-7xl mx-auto">
        
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-wide uppercase">
            {t?.("hero.badge") ?? (lang === "ar" ? "🔥 عرض خاص لفترة محدودة" : "🔥 Limited Time Offer")}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-4 mb-8 max-w-2xl">
          {title && (
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-md">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-base sm:text-xl font-normal text-gray-200 leading-relaxed drop-shadow">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Link
            to={link}
            className="inline-flex items-center justify-center gap-3 rounded-card bg-primary px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:opacity-90 hover:scale-105 active:scale-100 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>{t?.("hero.shopNow") ?? (lang === "ar" ? "تسوق الآن" : "Shop Now")}</span>
            <svg 
              className={`w-5 h-5 transition-transform duration-[var(--duration-normal)] ${
                isRTL ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}