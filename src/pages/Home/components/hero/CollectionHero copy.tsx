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
      className="relative w-full overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-2xl)] transition-all duration-[var(--duration-normal)] group"
    >
      {/* Dynamic Ambient Background Glows */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none blur-[140px] transition-all duration-[var(--duration-slow)] group-hover:scale-110"
        style={{ backgroundColor: "var(--color-primary)" }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none blur-[120px] transition-all duration-[var(--duration-slow)] group-hover:scale-110"
        style={{ backgroundColor: "var(--color-blue-400)" }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center min-h-[560px]">
        
        {/* Content Section (7 Columns) */}
        <div className="flex flex-col justify-center lg:col-span-7 z-10 p-[var(--spacing-8)] sm:p-[var(--spacing-12)] lg:p-[var(--spacing-16)] gap-[var(--spacing-6)]">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-[var(--spacing-2)] w-fit px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: "var(--color-primary)" }} />
            <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)] tracking-wide uppercase">
              {lang === "ar" ? "إصدار حصري محدود" : "Limited Exclusive Drop"}
            </span>
          </div>

          <div className="flex flex-col gap-[var(--spacing-4)]">
            <h1 className="text-[var(--text-3xl)] sm:text-[var(--text-5xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight leading-[1.1]">
              {title}
            </h1>

            {subtitle && (
              <p className="text-[var(--text-base)] sm:text-[var(--text-lg)] font-[var(--font-normal)] text-[var(--color-text-secondary)] leading-relaxed max-w-[560px]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Action Buttons & Features */}
          <div className="flex flex-wrap items-center gap-[var(--spacing-4)] pt-[var(--spacing-2)]">
            <Button
              asChild
              className="inline-flex items-center justify-center gap-[var(--spacing-3)] rounded-[var(--radius-xl)] bg-[var(--button-bg)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-[var(--text-base)] font-[var(--font-semibold)] text-[var(--button-text)] shadow-[var(--shadow-lg)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:bg-[var(--button-bg-hover)] hover:shadow-[var(--shadow-xl)] hover:-translate-y-1 active:translate-y-0"
            >
              <a href={item.link ?? "/products"}>
                <span>{lang === "ar" ? "تسوق المجموعة الآن" : "Shop Collection"}</span>
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

        {/* Artistic 3D Floating Image Showcase (5 Columns) */}
        <div className="relative lg:col-span-5 h-[420px] sm:h-[500px] lg:h-[600px] w-full overflow-hidden flex items-center justify-center p-6 lg:p-10">
          
          {image && (
            <div className="relative w-full h-full max-w-[440px] max-h-[500px] rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] group/card">
              
              {/* Main Product/Collection Image with Zoom Effect */}
              <img
                src={image}
                alt={title || "Collection Hero Image"}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover/card:scale-105"
                loading="lazy"
              />

              {/* Glassmorphic Floating Badge Inside Image */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-[var(--radius-xl)] bg-[var(--color-background)]/80 backdrop-blur-md border border-[var(--color-border)] shadow-lg flex items-center justify-between transform transition-transform duration-300 group-hover/card:-translate-y-1">
                <div>
                  <span className="block text-[var(--text-xs)] text-[var(--color-text-muted)]">
                    {lang === "ar" ? "الجودة المضمونة" : "Guaranteed Quality"}
                  </span>
                  <span className="text-[var(--text-sm)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
                    {lang === "ar" ? "توصيل سريع متاح" : "Fast Shipping Ready"}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-inverse)]">
                  ✓
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}