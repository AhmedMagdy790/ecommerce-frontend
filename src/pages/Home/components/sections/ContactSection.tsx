// src/pages/Home/components/sections/ContactSection.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

interface ContactBannerProps {
  section: Section<string>;
}

export default function ContactSection({ section }: ContactBannerProps) {
  const { isRTL } = useLang();

  // جلب النصوص ديناميكياً من بيانات القسم
  const badgeText = String(section.name ?? "");
  const title = String(section.title ?? "");
  const description = String(section.subtitle ?? section.description ?? "");
  const link = String(section.link ?? "");
  const buttonText = String(section.button_text ?? section.action_text ?? "");

  return (
    <section className="relative py-24 overflow-hidden bg-background" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* خلفية ضوئية ناعمة متكيفة تلقائياً مع الثيم */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[650px] h-[400px] bg-primary/15 blur-[150px] rounded-full pointer-events-none" />

      <Container size="lg" className="relative z-10 text-center space-y-8">
        
        {/* شارة تعريفية أنيقة */}
        {badgeText && (
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-5 py-2 text-xs font-bold text-primary shadow-xs">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* العنوان الرئيسي */}
        {title && (
          <h2 className="text-4xl sm:text-6xl font-bold text-text-primary tracking-tight leading-[1.1]">
            {title}
          </h2>
        )}

        {/* الوصف */}
        {description && (
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-text-secondary font-medium leading-relaxed">
            {description}
          </p>
        )}

        {/* زر التفاعل (CTA) */}
        {link && (
          <div className="pt-4">
            <a
              href={link}
              className="group inline-flex items-center gap-4 rounded-card bg-primary text-text-inverse px-10 py-5 text-base font-bold shadow-xl transition-all duration-[var(--duration-normal)] hover:bg-primary-hover hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {buttonText && <span>{buttonText}</span>}
              <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-white/20 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
                &rarr;
              </span>  
            </a>
          </div>
        )}

      </Container>
    </section>
  );
}