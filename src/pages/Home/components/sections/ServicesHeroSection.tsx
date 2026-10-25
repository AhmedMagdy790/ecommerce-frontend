// src/pages/Home/components/sections/ServicesHeroSection.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

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
    <section className="relative py-24 bg-background overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* خلفية ضوئية جمالية متوافقة مع الثيم */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

      <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* جهة النصوص والمحتوى */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
          
          {/* شارة تصنيف القسم */}
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{badgeText}</span>
            </div>
          )}

          {/* العنوان الرئيسي */}
          {title && (
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.15]">
              {title}
            </h1>
          )}

          {/* الوصف */}
          {subtitle && (
            <p className="mx-auto lg:mx-0 max-w-2xl text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* زر التفاعل (CTA) */}
          {link && (
            <div className="pt-2 flex justify-center lg:justify-start">
              <a
                href={link}
                className="group inline-flex items-center gap-3 rounded-card bg-primary text-text-inverse px-8 py-4 text-base font-bold shadow-lg transition-all duration-[var(--duration-normal)] hover:bg-primary-hover hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {buttonText && <span>{buttonText}</span>}
                <span className={`flex items-center justify-center transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
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
              <div className="aspect-[4/3] overflow-hidden rounded-panel shadow-xl border border-border group bg-surface">
                <img
                  src={image}
                  alt={title || "Services Hero"}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}

            {/* بطاقة عائمة ديناميكية */}
            {(floatTitle || floatSubtitle) && (
              <div className={`absolute -bottom-5 ${isRTL ? "-left-4" : "-right-4"} hidden sm:flex items-center gap-3 p-4 bg-surface rounded-card shadow-lg border border-border backdrop-blur-md`}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  ✓
                </div>
                <div className="flex flex-col">
                  {floatTitle && (
                    <span className="text-sm font-bold text-text-primary">
                      {floatTitle}
                    </span>
                  )}
                  {floatSubtitle && (
                    <span className="text-xs text-text-secondary">
                      {floatSubtitle}
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </Container>
    </section>
  );
}