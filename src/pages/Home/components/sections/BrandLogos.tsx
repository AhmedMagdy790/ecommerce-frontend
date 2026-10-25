// src/pages/Home/components/sections/BrandLogos.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

interface BrandItem {
  id: string | number;
  name: string;
  logo: string;
  link?: string;
}

interface BrandLogosProps {
  section: Section<string> & {
    brands?: BrandItem[];
    items?: BrandItem[];
  };
}

export default function BrandLogos({ section }: BrandLogosProps) {
  const { isRTL } = useLang();

  // Support section.data, brands, or items
  const rawBrands = (section.data || section.brands || section.items || []) as BrandItem[];

  if (!rawBrands.length) return null;

  const sectionTitle = section.name || "";

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 bg-background">
      <Container>
        {/* Header */}
        {sectionTitle && (
          <h2 className="mb-10 text-center text-3xl font-bold text-text-primary md:text-4xl tracking-tight">
            {sectionTitle}
          </h2>
        )}

        {/* Logos Grid */}
        <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4 lg:grid-cols-6">
          {rawBrands.map((brand, index) => (
            <a
              key={brand.id || index}
              href={brand.link || "#"}
              className="flex h-24 items-center justify-center rounded-panel border border-border bg-surface p-5 transition-all duration-300 hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <img
                src={brand.logo}
                alt={brand.name || "Brand Logo"}
                className="max-h-12 max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}