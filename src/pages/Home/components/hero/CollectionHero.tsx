// src/pages/Home/components/sections/CollectionHero.tsx

import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/ui/Button";
import type { Section } from "../SectionRenderer";

interface CollectionHeroProps {
  section: Section;
}

export function CollectionHero({ section }: CollectionHeroProps) {
  const { lang, isRTL } = useLang();

  const item = section.items?.[0] ?? section.data?.[0];

  if (!item) return null;

  const title = item.title?.[lang] ?? item.title?.en ?? item.title?.ar;
  const subtitle = item.subtitle?.[lang] ?? item.subtitle?.en ?? item.subtitle?.ar;
  const image = item.image ?? item.icon;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full h-[85vh] min-h-[600px] max-h-[850px] overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--color-border)] shadow-[var(--shadow-2xl)] group"
    >
      {/* Background Full-Screen Image with Smooth Zoom & Cinematic Filter */}
      {image && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={image}
            alt={title || "Collection Hero Background"}
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-[var(--ease-default)] group-hover:scale-105"
            loading="lazy"
          />
          {/* Advanced Multi-layer Gradient Overlay for High Contrast & Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content Container Positioned over the Full-Screen Image */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-[var(--spacing-8)] sm:p-[var(--spacing-12)] lg:p-[var(--spacing-16)] max-w-4xl">
        
        {/* Floating Minimalist Badge */}
        <div className="inline-flex items-center gap-[var(--spacing-2)] w-fit px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-[var(--spacing-6)]">
          <span className="w-2.5 h-2.5 rounded-full animate-ping bg-[var(--color-primary)]" />
          <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-white tracking-wide uppercase">
            {lang === "ar" ? "✨ تجربة بصرية سينمائية" : "✨ Cinematic Experience"}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-[var(--spacing-4)] mb-[var(--spacing-8)]">
          <h1 className="text-[var(--text-4xl)] sm:text-[var(--text-6xl)] font-[var(--font-bold)] text-white tracking-tight leading-[1.1] drop-shadow-md">
            {title}
          </h1>

          {subtitle && (
            <p className="text-[var(--text-base)] sm:text-[var(--text-xl)] font-[var(--font-normal)] text-gray-200 leading-relaxed max-w-[640px] drop-shadow">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-[var(--spacing-4)]">
          <Button
            asChild
            className="inline-flex items-center justify-center gap-[var(--spacing-3)] rounded-[var(--radius-xl)] bg-[var(--button-bg)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-[var(--text-base)] font-[var(--font-semibold)] text-[var(--button-text)] shadow-xl transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:bg-[var(--button-bg-hover)] hover:scale-105 active:scale-100"
          >
            <a href={item.link ?? "/products"}>
              <span>{lang === "ar" ? "استعرض الآن" : "Explore Now"}</span>
              <svg 
                className={`w-5 h-5 transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}