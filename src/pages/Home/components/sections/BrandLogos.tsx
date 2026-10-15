// src/pages/Home/components/sections/BrandLogos.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";

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

  // Support section.data, brands, or items
  const rawBrands = (section.data || section.brands || section.items || []) as BrandItem[];

  if (!rawBrands.length) return null;

  const sectionTitle = section.name || "";

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[var(--container-xl)]">
        {/* Header */}
        {sectionTitle && (
          <h2 className="mb-10 text-center text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
            {sectionTitle}
          </h2>
        )}

        {/* Logos Grid */}
        <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4 lg:grid-cols-6">
          {rawBrands.map((brand) => (
            <a
              key={brand.id}
              href={brand.link || "#"}
              className="flex h-24 items-center justify-center rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-background-surface)] p-5 transition hover:shadow-md"
            >
              <img
                src={brand.logo}
                alt={brand.name || "Brand Logo"}
                className="max-h-12 max-w-full object-contain grayscale transition hover:grayscale-0"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}