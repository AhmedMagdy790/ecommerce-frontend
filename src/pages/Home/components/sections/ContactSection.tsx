// src/pages/Home/components/sections/ContactSection.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";

interface ContactBannerProps {
  section: Section<string>;
}

export default function ContactSection({ section }: ContactBannerProps) {
  const { isRTL } = useLang();

  // console.log("section", section)

  // جلب النصوص ديناميكياً من بيانات القسم
  const badgeText = String(section.name ?? "");
  const title = String(section.title ?? "");
  const description = String(section.subtitle ?? section.description ?? "");
  const link = String(section.link ?? "");
  const buttonText = String(section.button_text ?? section.action_text ?? "");

  return (
    <section className="relative py-[var(--spacing-24)] px-[var(--spacing-6)] overflow-hidden bg-[var(--color-background)]" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* خلفية ضوئية ناعمة متكيفه تلقائياً مع الثيم */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[650px] h-[400px] bg-[var(--color-primary)]/15 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[var(--container-lg)] text-center space-y-[var(--spacing-8)]">
        
        {/* شارة تعريفية أنيقة */}
        {badgeText && (
          <div className="inline-flex items-center gap-[var(--spacing-2)] rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-[var(--spacing-5)] py-[var(--spacing-2)] text-xs font-[var(--font-bold)] text-[var(--color-primary)] shadow-[var(--shadow-xs)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* العنوان الرئيسي */}
        {title && (
          <h2 className="text-[var(--text-4xl)] sm:text-[var(--text-6xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight leading-[1.1]">
            {title}
          </h2>
        )}

        {/* الوصف */}
        {description && (
          <p className="mx-auto max-w-2xl text-[var(--text-lg)] sm:text-[var(--text-xl)] text-[var(--color-text-secondary)] font-[var(--font-medium)] leading-relaxed">
            {description}
          </p>
        )}

        {/* زر التفاعل (CTA) */}
        {link && (
          <div className="pt-[var(--spacing-4)]">
            <a
              href={link}
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
              }}
              className="group inline-flex items-center gap-[var(--spacing-4)] rounded-[var(--radius-2xl)] px-[var(--spacing-10)] py-[var(--spacing-5)] text-[var(--text-base)] font-[var(--font-bold)] shadow-[var(--shadow-xl)] transition-all duration-[var(--duration-normal)] hover:bg-[var(--button-bg-hover)] hover:scale-105 active:scale-95"
            >
              {buttonText && <span>{buttonText}</span>}
              <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}>
                &rarr;
              </span>  
            </a>
          </div>
        )}

      </div>
    </section>
  );
}