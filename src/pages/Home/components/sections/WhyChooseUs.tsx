// src/pages/Home/components/sections/WhyChooseUs.tsx

import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";
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

  // جلب العناصر (Items) الخاصة بالقسم بشكل آمن (دعم data أو items)
  const items = Array.isArray(section?.data) ? section.data : (Array.isArray(section?.items) ? section.items : []);

  if (!items.length) return null;

  // استخراج العنوان الرئيسي للقسم باستخدام normalizeNullable
  const sectionTitle = normalizeNullable(section?.name);

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden py-20 bg-surface/50 border-y border-border"
    >
      <Container>
        
        {/* Section Header */}
        {sectionTitle && (
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-3">
              {sectionTitle}
            </h2>
            <p className="text-base text-text-secondary">
              {t("sections.whyChooseUsSubtitle", "نحن نقدم أفضل تجربة تسوق لعملائنا بكل احترافية")}
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            // اختيار أيقونة بشكل تسلسلي أو افتراضي
            const IconComponent = iconsList[index % iconsList.length];

            // استخدام normalizeNullable لاستخراج العنوان والنص الفرعي لكل عنصر
            const itemTitle = normalizeNullable(item?.title);
            const itemDesc = normalizeNullable(item?.description);

            return (
              <div 
                key={item.id || index}
                className="flex flex-col items-start p-6 rounded-card bg-background border border-border shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-control bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <IconComponent size={24} />
                </div>

                {/* Title */}
                {itemTitle && (
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {itemTitle}
                  </h3>
                )}

                {/* Description */}
                {itemDesc && (
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {itemDesc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}