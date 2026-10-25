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

  // القراءة الآمنة للشرائح من data
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

  // معالجة النصوص سواء كانت String أو Object
  const rawTitle = typeof currentItem.title === "object" ? (currentItem.title?.[lang] ?? currentItem.title?.en) : currentItem.title;
  const rawSubtitle = typeof currentItem.subtitle === "object" ? (currentItem.subtitle?.[lang] ?? currentItem.subtitle?.en) : currentItem.subtitle;

  const title = normalizeNullable(rawTitle);
  const subtitle = normalizeNullable(rawSubtitle);
  const image = normalizeNullable(currentItem.image);
  const link = normalizeNullable(currentItem.link) ?? "/products";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full h-[85vh] min-h-[600px] max-h-[850px] overflow-hidden rounded-panel border border-border shadow-2xl my-8 group"
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
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 sm:p-12 lg:p-16 max-w-4xl">
        
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-6">
          <span className="w-2.5 h-2.5 rounded-full animate-ping bg-primary" />
          <span className="text-xs font-semibold text-white tracking-wide uppercase">
            {t?.("hero.featuredCollection") ?? (lang === "ar" ? "✨ تشكيلة مميزة" : "✨ Featured Collection")}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-4 mb-8">
          {title && (
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-md">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-base sm:text-xl font-normal text-gray-200 leading-relaxed max-w-[640px] drop-shadow">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Button & Navigation Dots */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <Link
            to={link}
            className="inline-flex items-center justify-center gap-3 rounded-card bg-primary px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:opacity-90 hover:scale-105 active:scale-100 w-fit group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit">
              {items.map((_: unknown, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? "w-8 bg-primary" 
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