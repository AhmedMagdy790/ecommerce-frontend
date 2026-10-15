// src/pages/Home/components/sections/SliderHero.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import type { Section } from "@/features/cms/section/model/types/section.types";
import { normalizeNullable } from "@/shared/utils/normalizeNullable";

interface SliderHeroProps {
  section: Section;
}

export function SliderHero({ section }: SliderHeroProps) {
  const { lang, isRTL, t } = useLang();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. القراءة الآمنة للشرائح من data
  const items = Array.isArray(section.data) && section.data.length > 0 
    ? section.data 
    : (Array.isArray(section.items) ? section.items : []);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 6000); // تغيير الشريحة كل 6 ثواني

    return () => clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  // 2. معالجة النصوص سواء كانت String أو Object
  const rawTitle = typeof currentItem.title === "object" ? (currentItem.title?.[lang] ?? currentItem.title?.en) : currentItem.title;
  const rawSubtitle = typeof currentItem.subtitle === "object" ? (currentItem.subtitle?.[lang] ?? currentItem.subtitle?.en) : currentItem.subtitle;

  const title = normalizeNullable(rawTitle);
  const subtitle = normalizeNullable(rawSubtitle);
  const image = normalizeNullable(currentItem.image);
  const link = normalizeNullable(currentItem.link) ?? "/products";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full h-[85vh] min-h-[600px] max-h-[850px] overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--color-border)] shadow-[var(--shadow-2xl)] my-[var(--spacing-8)] group"
    >
      {/* Background Image with Dynamic Gradient Based on Direction */}
      {image && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            key={image} // إحداث تأثير الانتقال عند التغيير
            src={image}
            alt={title || "Slider Hero Background"}
            className="w-full h-full object-cover object-center transition-all duration-1000 ease-[var(--ease-default)] scale-105 animate-fade-in"
            loading={currentIndex === 0 ? "eager" : "lazy"}
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
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-[var(--spacing-8)] sm:p-[var(--spacing-12)] lg:p-[var(--spacing-16)] max-w-4xl">
        
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-[var(--spacing-2)] w-fit px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-[var(--spacing-6)]">
          <span className="w-2.5 h-2.5 rounded-full animate-ping bg-[var(--color-primary,#3b82f6)]" />
          <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-white tracking-wide uppercase">
            {t?.("hero.featuredCollection") ?? (lang === "ar" ? "✨ تشكيلة مميزة" : "✨ Featured Collection")}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-[var(--spacing-4)] mb-[var(--spacing-8)]">
          {title && (
            <h1 className="text-[var(--text-4xl)] sm:text-[var(--text-6xl)] font-[var(--font-bold)] text-white tracking-tight leading-[1.1] drop-shadow-md">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-[var(--text-base)] sm:text-[var(--text-xl)] font-[var(--font-normal)] text-gray-200 leading-relaxed max-w-[640px] drop-shadow">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Button & Navigation Dots */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--spacing-6)]">
          <Link
            to={link}
            className="inline-flex items-center justify-center gap-[var(--spacing-3)] rounded-[var(--radius-xl)] bg-[var(--color-primary,#3b82f6)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-[var(--text-base)] font-[var(--font-semibold)] text-white shadow-xl transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:opacity-90 hover:scale-105 active:scale-100 w-fit group/btn"
          >
            <span>{t?.("hero.exploreNow") ?? (lang === "ar" ? "استعرض الآن" : "Explore Now")}</span>
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

          {/* Dots Indicators */}
          {items.length > 1 && (
            <div className="flex items-center gap-[var(--spacing-2)] bg-black/30 backdrop-blur-md px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-full)] border border-white/10 w-fit">
              {items.map((_: unknown, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? "w-8 bg-[var(--color-primary,#3b82f6)]" 
                      : "w-2.5 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}