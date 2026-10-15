// src/features/cms/hero/HeroRenderer.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { CollectionHero } from "./CollectionHero";
import { FullWidthHero } from "./FullWidthHero";
import { SliderHero } from "./SliderHero";

const heroComponents = {
  collection: CollectionHero,
  full_width: FullWidthHero,
  slider: SliderHero,
} as const;

type HeroLayout = keyof typeof heroComponents;

interface HeroRendererProps {
  section: Section;
}

export default function HeroRenderer({ section }: HeroRendererProps) {
  if (import.meta.env.DEV) {
    console.log("Hero Section Data:", section);
  }

  // 1. استخراج الـ Layout أولاً من الـ settings.layout
  // 2. إذا لم يوجد، نفحص نوع الـ Section أو افتراضياً "collection"
  const rawLayout = section.settings?.layout;

  // تحويل القيمة للغة صغيرة وحظر القيم غير المعرفة
  const normalizedLayout = rawLayout 
    ? (String(rawLayout).toLowerCase() as HeroLayout) 
    : "collection";

  // اختيار المكون من القائمة أو اعتماد CollectionHero كافتراضي
  const Component = heroComponents[normalizedLayout] ?? CollectionHero;

  // التحقق من وجود بيانات داخل الـ section.data قبل الرندر
  const hasData = Array.isArray(section.data) && section.data.length > 0;

  if (!hasData) {
    if (import.meta.env.DEV) {
      console.warn(`HeroRenderer: Section "${section.name}" has no items in data.`);
    }
    return null;
  }

  return <Component section={section as Section<string>} />;
}