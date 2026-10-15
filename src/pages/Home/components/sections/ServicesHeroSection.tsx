// src/pages/Home/components/sections/ServicesHeroSection.tsx
import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";

interface ServicesHeroSectionProps {
  section: Section<string> & {
    title?: string;
    subtitle?: string;
    image?: string;
    link?: string;
    data?: any[];
    items?: any[];
  };
}

export default function ServicesHeroSection({ section }: ServicesHeroSectionProps) {
  const { lang, isRTL } = useLang();
  
  const rawItems = section.data || section.items || [];
  const item = rawItems[0] || {};

  // استخراج النصوص المباشرة
  const badgeText = section.name || "";
  const title = item.title || section.title || "";
  const subtitle = item.subtitle || item.description || section.subtitle || "";
  const image = item.image || section.image || "";
  const link = item.link || section.link || "";
  const buttonText = item.button_text || item.action_text || (lang === "ar" ? "ابدأ الان" : "Get Started");
  
  // بيانات البطاقة العائمة
  const floatTitle = item.float_title || item.badge_title || "";
  const floatSubtitle = item.float_subtitle || item.badge_subtitle || "";

  return (
    <section className="relative py-[var(--spacing-24)] px-[var(--spacing-6)] bg-[var(--color-background)] overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* خلفية ضوئية جمالية متوافقة مع الثيم */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] bg-[var(--color-primary)]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[var(--container-xl)] grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-12)] items-center">
        
        {/* جهة النصوص والمحتوى */}
        <div className="lg:col-span-7 space-y-[var(--spacing-6)] text-center lg:text-start">
          
          {/* شارة تصنيف القسم */}
          {badgeText && (
            <div className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-[var(--font-semibold)] text-[var(--text-xs)] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span>{badgeText}</span>
            </div>
          )}

          {/* العنوان الرئيسي */}
          {title && (
            <h1 className="text-[var(--text-3xl)] sm:text-[var(--text-5xl)] lg:text-[var(--text-6xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)] leading-[1.15]">
              {title}
            </h1>
          )}

          {/* الوصف */}
          {subtitle && (
            <p className="mx-auto lg:mx-0 max-w-2xl text-[var(--text-base)] sm:text-[var(--text-lg)] text-[var(--color-text-secondary)] font-[var(--font-medium)] leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* زر التفاعل (CTA) */}
          {link && (
            <div className="pt-[var(--spacing-2)] flex justify-center lg:justify-start">
              <a
                href={link}
                style={{
                  backgroundColor: "var(--button-bg)",
                  color: "var(--button-text)",
                }}
                className="group inline-flex items-center gap-[var(--spacing-3)] rounded-[var(--radius-2xl)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-[var(--text-base)] font-[var(--font-bold)] shadow-[var(--shadow-lg)] transition-all duration-[var(--duration-normal)] hover:bg-[var(--button-bg-hover)] hover:scale-105 active:scale-95"
              >
                {buttonText && <span>{buttonText}</span>}
                <span className={`flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}>
                  &rarr;
                </span>
              </a>
            </div>
          )}

        </div>

        {/* جهة الصورة */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            
            {image && (
              <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-3xl)] shadow-[var(--shadow-xl)] border border-[var(--color-border)] group bg-[var(--color-surface)]">
                <img
                  src={image}
                  alt={title || ""}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}

            {/* بطاقة عائمة ديناميكية */}
            {(floatTitle || floatSubtitle) && (
              <div className={`absolute -bottom-5 ${isRTL ? "-left-4" : "-right-4"} hidden sm:flex items-center gap-3 p-[var(--spacing-4)] bg-[var(--card-bg)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-lg)] border border-[var(--card-border)] backdrop-blur-md`}>
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold">
                  ✓
                </div>
                <div className="flex flex-col">
                  {floatTitle && (
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                      {floatTitle}
                    </span>
                  )}
                  {floatSubtitle && (
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {floatSubtitle}
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}