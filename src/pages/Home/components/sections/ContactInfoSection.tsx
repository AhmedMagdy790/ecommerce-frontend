// src/pages/Home/components/sections/ContactInfoSection.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";

interface ContactInfoSectionProps {
  section: Section<string>;
}

export default function ContactInfoSection({ section }: ContactInfoSectionProps) {
  const { lang, isRTL } = useLang();
  

  // console.log("section", section)

  const rawItems = section?.data || [];

  // دالة مبسطة لاستخراج النص المباشر مع دعم احتياطي سلس
  const getText = (text?: string) => text || "";

  const sectionTitle = getText(section.title || section.name);
  const sectionSubtitle = getText(section.subtitle || section.description);

  return (
    <section className="py-[var(--spacing-20)] px-[var(--spacing-6)] bg-[var(--color-background)]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[var(--container-xl)] space-y-[var(--spacing-12)]">
        
        {/* عنوان القسم ووصفه (من لوحة التحكم ديناميكياً) */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center space-y-[var(--spacing-3)] max-w-2xl mx-auto">
            {sectionTitle && (
              <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-[var(--color-text-secondary)] text-[var(--text-base)] font-[var(--font-medium)] leading-relaxed">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* شبكة البطاقات */}
        {rawItems.length === 0 ? (
          <div className="text-center py-[var(--spacing-12)] text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-3xl)] bg-[var(--color-surface)]">
            {lang === "ar" ? "لا توجد عناصر متاحة حالياً" : "No items available at the moment"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-8)]">
            {rawItems.map((item) => (
              <div 
                key={item.id || item.sort_order}
                className="group relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--radius-3xl)] p-[var(--spacing-8)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--duration-normal)] text-center space-y-[var(--spacing-4)] overflow-hidden"
              >
                {/* تأثير خلفية خفيف عند التحويم */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 space-y-[var(--spacing-4)]">
                  {/* عنوان العنصر */}
                  {item.title && (
                    <h3 className="text-[var(--text-xl)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
                      {item.title}
                    </h3>
                  )}

                  {/* الوصف أو البيانات التابعة */}
                  {(item.subtitle || item.description) && (
                    <p className="text-[var(--color-text-secondary)] text-[var(--text-base)] font-[var(--font-medium)] leading-relaxed">
                      {item.subtitle || item.description}
                    </p>
                  )}

                  {/* رابط التفاعل */}
                  {item.link && (
                    <div className="pt-2">
                      <a
                        href={item.link}
                        className="inline-flex items-center gap-[var(--spacing-2)] text-sm font-[var(--font-semibold)] text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                      >
                        <span>{item.button_text || item.action_text || (lang === "ar" ? "تواصل الآن" : "Reach Out")}</span>
                        <span className={`transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}>
                          &rarr;  
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}