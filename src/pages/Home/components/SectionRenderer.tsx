
import { useTranslation } from "react-i18next";

import { sectionRegistry } from "../registry";

interface SectionRendererProps {
  sections: Array<{
    type: keyof typeof sectionRegistry;
    data: Record<string, any>;
  }>;
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const Component = sectionRegistry[section.type];

        if (!Component) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Section renderer: Component not found for type "${section.type}"`);
          }
          return null;
        }

        // The spread operator is the "Flat Prop" magic
        return (
          <Component
            key={`${section.type}-${index}`}
            {...section.data}
          />
        );
      })}
    </>
  );
}