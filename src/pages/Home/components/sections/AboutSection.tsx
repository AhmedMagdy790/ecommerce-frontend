import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";

interface AboutSectionProps {
  section: Section<string>;
}

export default function AboutSection({ section }: AboutSectionProps) {
  const { isRTL } = useLang();

  // فحص أيهما يحتوي على عناصر لتجنب فخ المصفوفة الفارغة []
  const rawItems = section.data || [];

  const item = rawItems[0] || {};

  const badgeText = section.name || "";
  const title = item.title || section.title || "";
  const description = item.subtitle || item.description || section.subtitle || "";
  const image = item.image || section.image || "";
  const link = item.link || section.link || "";
  const linkText = item.button_text || item.action_text || "اقرأ المزيد";

  // بيانات البطاقة العائمة
  const floatStat = item.stat_number || item.float_title || "";
  const floatText = item.stat_text || item.float_subtitle || "";

  return (
    <section className="py-[var(--spacing-20)] px-[var(--spacing-6)] bg-[var(--color-background)]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[var(--container-xl)] grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-12)] items-center">
        
        {/* جهة النصوص والمحتوى */}
        <div className="lg:col-span-6 space-y-[var(--spacing-6)]">
          
          {/* شارة تصنيف القسم */}
          {badgeText && (
            <div className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-[var(--font-semibold)] text-[var(--text-xs)] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span>{badgeText}</span>
            </div>
          )}

          {/* العنوان الرئيسي */}
          {title && (
            <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] lg:text-[var(--text-5xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)] leading-[1.2]">
              {title}
            </h2>
          )}

          {/* الوصف أو النبذة */}
          {description && (
            <p className="text-[var(--text-base)] sm:text-[var(--text-lg)] text-[var(--color-text-secondary)] font-[var(--font-medium)] leading-relaxed max-w-xl">
              {description}
            </p>
          )}

          {/* زر الاستكشاف أو الرابط */}
          {(link || linkText) && (
            <div className="pt-[var(--spacing-2)]">
              <a
                href={link || "#"}
                className="group inline-flex items-center gap-[var(--spacing-3)] font-[var(--font-semibold)] text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
              >
                {linkText && <span>{linkText}</span>}
                <span className={`flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}>
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
              <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-3xl)] shadow-[var(--shadow-xl)] border border-[var(--color-border)] group bg-[var(--color-surface)]">
                <img
                  src={image}
                  alt={title || ""}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}

            {/* بطاقة إحصائية عائمة */}
            {(floatStat || floatText) && (
              <div className={`absolute -bottom-6 ${isRTL ? "-left-6" : "-right-6"} hidden sm:flex flex-col p-[var(--spacing-6)] bg-[var(--card-bg)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-xl)] border border-[var(--card-border)] backdrop-blur-md`}>
                {floatStat && (
                  <span className="text-[var(--text-2xl)] font-[var(--font-bold)] text-[var(--color-primary)]">
                    {floatStat}
                  </span>
                )}
                {floatText && (
                  <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)] font-[var(--font-medium)]">
                    {floatText}
                  </span>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}