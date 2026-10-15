// src/pages/Home/components/sections/TextSection.tsx
import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";

interface TextSectionProps {
  section: Section<string>;
}

export default function TextSection({ section }: TextSectionProps) {
  const { isRTL } = useLang();

  const rawItems = section.data || [];
  
  if (!rawItems.length) return null;

  const item = rawItems[0]; // أخذ العنصر الأول للنص

  const title = item.title || "";
  // دعم حقل المحتوى، الوصف، أو العنوان الفرعي كـ string مباشر
  const content = item.content || item.description || item.subtitle || "";

  return (
    <section className="py-[var(--spacing-16)] px-[var(--spacing-6)] bg-[var(--color-background)]" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[var(--container-md)] space-y-[var(--spacing-6)] text-center">
        
        {/* عنوان القسم */}
        {title && (
          <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text)]">
            {title}
          </h2>
        )}

        {/* خط فاصل جمالي صغير */}
        <div className="mx-auto w-12 h-1 bg-[var(--color-primary)] rounded-[var(--radius-full)]" />

        {/* محتوى النص أو المقال */}
        {content && (
          <div className="text-[var(--text-base)] sm:text-[var(--text-lg)] text-gray-600 dark:text-gray-300 leading-relaxed font-[var(--font-normal)] whitespace-pre-line text-start sm:text-center">
            {content}
          </div>
        )}

      </div>
    </section>
  );
}