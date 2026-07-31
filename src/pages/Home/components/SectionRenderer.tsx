// src/pages/Home/components/SectionRenderer.tsx
import {
  sectionRegistry,
  sectionKeyRegistry,
  type SectionType,
  type SectionKey,
} from "../registry";

export interface SectionItem {
  id: number;
  title?: { ar: string; en: string; };
  subtitle?: { ar: string; en: string; };
  image?: string;
  link?: string;
  data?: Record<string, unknown>;
}

export interface Section {
  id: number;
  name: { ar: string; en: string; };
  key: string;
  type: string;
  sort_order: number;
  items: SectionItem[];
}

interface SectionRendererProps {
  sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {

  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);


  return (
    <>
      {sortedSections.map((section) => {
        const keyExists = section.key in sectionRegistry;
        const typeExists = section.type in sectionRegistry;

        // if (import.meta.env.DEV) {
        //   console.group(`Section #${section.id}`);
        //   console.log("key:", section.key, keyExists ? "✅" : "❌");
        //   console.log("type:", section.type, typeExists ? "✅" : "❌");
        //   console.groupEnd();
        // }


        const keyComponent =
          section.key in sectionKeyRegistry
            ? sectionKeyRegistry[section.key as keyof typeof sectionKeyRegistry]
            : undefined;

        const typeComponent =
          section.type in sectionRegistry
            ? sectionRegistry[section.type as keyof typeof sectionRegistry]
            : undefined;

        const Component = keyComponent ?? typeComponent;

        if (!Component) {
          console.warn(
            `No component found for key="${section.key}" type="${section.type}"`
          );
          return null;
        }

        return <Component key={section.id} section={section} />;
      })}
    </>
  );
}