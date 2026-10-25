// src/pages/Home/components/sections/ContactInfoSection.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

interface ContactInfoSectionProps {
  section: Section<string>;
}

export default function ContactInfoSection({ section }: ContactInfoSectionProps) {
  const { lang, isRTL } = useLang();

  const rawItems = section?.data || [];

  // دالة مبسطة لاستخراج النص المباشر مع دعم احتياطي سلس
  const getText = (text?: string) => text || "";

  const sectionTitle = getText(section.title || section.name);
  const sectionSubtitle = getText(section.subtitle || section.description);

  return (
    <section className="py-20 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Container className="space-y-12">
        
        {/* عنوان القسم ووصفه (من لوحة التحكم ديناميكياً) */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            {sectionTitle && (
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-text-secondary text-base font-medium leading-relaxed">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* شبكة البطاقات */}
        {rawItems.length === 0 ? (
          <div className="text-center py-12 text-text-muted border border-dashed border-border rounded-panel bg-surface">
            {lang === "ar" ? "لا توجد عناصر متاحة حالياً" : "No items available at the moment"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rawItems.map((item) => (
              <div 
                key={item.id || item.sort_order}
                className="group relative bg-surface border border-border rounded-panel p-8 shadow-xs hover:shadow-xl transition-all duration-[var(--duration-normal)] text-center space-y-4 overflow-hidden focus-within:ring-2 focus-within:ring-primary"
              >
                {/* تأثير خلفية خفيف عند التحويم */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  {/* عنوان العنصر */}
                  {item.title && (
                    <h3 className="text-xl font-bold text-text-primary">
                      {item.title}
                    </h3>
                  )}

                  {/* الوصف أو البيانات التابعة */}
                  {(item.subtitle || item.description) && (
                    <p className="text-text-secondary text-base font-medium leading-relaxed">
                      {item.subtitle || item.description}
                    </p>
                  )}

                  {/* رابط التفاعل */}
                  {item.link && (
                    <div className="pt-2">
                      <a
                        href={item.link}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control"
                      >
                        <span>{item.button_text || item.action_text || (lang === "ar" ? "تواصل الآن" : "Reach Out")}</span>
                        <span className={`transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
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

      </Container>
    </section>
  );
}