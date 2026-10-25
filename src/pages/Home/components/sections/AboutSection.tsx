// src/pages/Home/components/sections/AboutSection.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

interface AboutSectionProps {
  section: Section<string>;
}

export default function AboutSection({ section }: AboutSectionProps) {
  const { isRTL, lang } = useLang();

  // فحص العناصر لتجنب فخ المصفوفة الفارغة
  const rawItems = Array.isArray(section.data) ? section.data : [];
  const item = rawItems[0] || {};

  const badgeText = section.name || "";
  const title = item.title || section.title || "";
  const description = item.subtitle || item.description || section.subtitle || "";
  const image = item.image || section.image || "";
  const link = item.link || section.link || "";
  const linkText = item.button_text || item.action_text || (lang === "ar" ? "اقرأ المزيد" : "Read More");

  // بيانات البطاقة العائمة
  const floatStat = item.stat_number || item.float_title || "";
  const floatText = item.stat_text || item.float_subtitle || "";

  return (
    <section className="py-20 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* جهة النصوص والمحتوى */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* شارة تصنيف القسم */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{badgeText}</span>
              </div>
            )}

            {/* العنوان الرئيسي */}
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.2]">
                {title}
              </h2>
            )}

            {/* الوصف أو النبذة */}
            {description && (
              <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed max-w-xl">
                {description}
              </p>
            )}

            {/* زر الاستكشاف أو الرابط */}
            {(link || linkText) && (
              <div className="pt-2">
                <a
                  href={link || "#"}
                  className="group inline-flex items-center gap-3 font-semibold text-primary hover:text-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control"
                >
                  {linkText && <span>{linkText}</span>}
                  <span className={`flex items-center justify-center transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
                    &rarr;
                  </span>
                </a>
              </div>
            )}
          </div>

          {/* جهة الصورة والتصميم الجمالي */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* حاوية الصورة */}
              {image && (
                <div className="aspect-[4/3] overflow-hidden rounded-panel shadow-xl border border-border group bg-surface">
                  <img
                    src={image}
                    alt={title || "About Section"}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              {/* بطاقة إحصائية عائمة */}
              {(floatStat || floatText) && (
                <div className={`absolute -bottom-6 ${isRTL ? "-left-6" : "-right-6"} hidden sm:flex flex-col p-6 bg-surface rounded-card shadow-xl border border-border backdrop-blur-md`}>
                  {floatStat && (
                    <span className="text-2xl font-bold text-primary">
                      {floatStat}
                    </span>
                  )}
                  {floatText && (
                    <span className="text-xs text-text-secondary font-medium">
                      {floatText}
                    </span>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}