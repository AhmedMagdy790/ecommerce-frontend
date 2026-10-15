import { useMemo, type ComponentType } from "react";
import {
  sectionRegistry,
  sectionKeyRegistry,
  normalizeSectionKey,
} from "../registry";
import type { Section } from "@/features/cms/section/model/types/section.types";

interface SectionRendererProps {
  sections?: Section[];
}

export default function SectionRenderer({ sections = [] }: SectionRendererProps) {

  const sortedSections = useMemo(() => {
    if (!Array.isArray(sections)) return [];

    return [...sections].sort(
      (a, b) => (Number(a?.sort_order ?? 0) - Number(b?.sort_order ?? 0))
    );
  }, [sections]);

  if (sortedSections.length === 0) {
    return null;
  }

  console.log("sortedSections", sortedSections)

  return (
    <>
      {sortedSections.map((section, index) => {
        // تم التعديل هنا إلى section (المفرد)

        
        const normalizedKey = normalizeSectionKey(section?.key);
        const normalizedType = normalizeSectionKey(section?.type as string | undefined);
        
        // console.log("normalizedKey", normalizedKey);
        // console.log("normalizedType", normalizedType);

        const keyComponent =
          normalizedKey && sectionKeyRegistry[normalizedKey as keyof typeof sectionKeyRegistry];
        const typeComponent =
          normalizedType && sectionRegistry[normalizedType as keyof typeof sectionRegistry];

        const Component = (keyComponent ?? typeComponent) as
          | ComponentType<{ section: Section }>
          | undefined;


        if (!Component) {
          if (import.meta.env.DEV) {
            console.warn(
              `⚠️ No renderer found for section key="${section?.key}" type="${section?.type}"`
            );
          }
          return null;
        }

        return (
          <Component
            key={section?.id ?? `${section?.key ?? "section"}-${index}`}
            section={section}
          />
        );
      })}
    </>
  );
}