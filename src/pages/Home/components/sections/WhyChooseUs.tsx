import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import type { Section } from "@/features/cms/section/model/types/section.types";
import { ShieldCheck, Truck, Headphones, Award, CheckCircle2 } from "lucide-react";
import { normalizeNullable } from "@/shared/utils/normalizeNullable";

interface WhyChooseUsProps {
  section: Section<string>;
}

const iconsList = [Truck, ShieldCheck, Headphones, Award, CheckCircle2];

export default function WhyChooseUs({ section }: WhyChooseUsProps) {
  const { isRTL } = useLang();
  const { t } = useTranslation();

  // جلب العناصر (Items) الخاصة بالقسم بشكل آمن
  const items = Array.isArray(section?.items) ? section.items : [];

  if (!items.length) return null;

  // استخراج العنوان الرئيسي للقسم باستخدام normalizeNullable
  const sectionTitle = normalizeNullable(section?.name);

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden px-[var(--spacing-6)] py-[var(--spacing-20)] bg-[var(--color-surface)]/50 border-y border-[var(--color-border)]"
    >
      <div className="relative mx-auto max-w-[var(--container-xl)]">
        
        {/* Section Header */}
        {sectionTitle && (
          <div className="text-center max-w-2xl mx-auto mb-[var(--spacing-16)]">
            <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight mb-[var(--spacing-3)]">
              {sectionTitle}
            </h2>
            <p className="text-[var(--text-base)] text-[var(--color-text-secondary)]">
              {t("sections.whyChooseUsSubtitle", "نحن نقدم أفضل تجربة تسوق لعملائنا بكل احترافية")}
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-[var(--spacing-8)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            // اختيار أيقونة بشكل تسلسلي أو افتراضي
            const IconComponent = iconsList[index % iconsList.length];

            // استخدام normalizeNullable لاستخراج العنوان والنص الفرعي لكل عنصر
            const itemTitle = normalizeNullable(item?.title);
            const itemDesc = normalizeNullable(item?.description);

            return (
              <div 
                key={item.id || index}
                className="flex flex-col items-start p-[var(--spacing-6)] rounded-[var(--radius-xl)] bg-[var(--color-background)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-1"
              >
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-[var(--spacing-4)]">
                  <IconComponent size={24} />
                </div>

                {/* Title */}
                {itemTitle && (
                  <h3 className="text-[var(--text-lg)] font-[var(--font-semibold)] text-[var(--color-text-primary)] mb-[var(--spacing-2)]">
                    {itemTitle}
                  </h3>
                )}

                {/* Description */}
                {itemDesc && (
                  <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] leading-relaxed">
                    {itemDesc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}