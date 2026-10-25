// src/pages/Home/components/sections/TextSection.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

interface TextSectionProps {
  section: Section<string>;
}

export default function TextSection({ section }: TextSectionProps) {
  const { isRTL } = useLang();

  const rawItems = section.data || [];
  
  if (!rawItems.length) return null;

  const item = rawItems[0];

  const title = item.title || "";
  const content = item.content || item.description || item.subtitle || "";

  return (
    <section className="py-16 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Container size="md">
        <div className="space-y-6 text-center">
          
          {/* عنوان القسم */}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {title}
            </h2>
          )}

          {/* خط فاصل جمالي صغير */}
          <div className="mx-auto w-12 h-1 bg-primary rounded-full" />

          {/* محتوى النص أو المقال */}
          {content && (
            <div className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal whitespace-pre-line text-start sm:text-center">
              {content}
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}