// src/pages/Home/components/sections/Categories.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface CategoriesProps {
  section: Section<string>;
}

export default function Categories({ section }: CategoriesProps) {
  const { lang, isRTL } = useLang();

  // دعم جميع الاحتمالات مع حماية تامة ضد الـ undefined أو null
  const rawItems = section.data || section.categories || section.items || [];
  
  if (!Array.isArray(rawItems) || !rawItems.length) return null;

  const categories = rawItems.map((item: any, index: number) => ({
    id: item.id || index,
    name: item.name,
    image: item.image || item.media?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    link: item.link || `/categories/${item.slug || item.id}`,
  }));

  const sectionTitle = section.name;

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full py-[var(--spacing-16)] px-[var(--spacing-4)] sm:px-[var(--spacing-6)] lg:px-[var(--spacing-8)] bg-[var(--color-background)]"
    >
      <div className="mx-auto max-w-[var(--container-2xl)]">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-[var(--spacing-10)] gap-[var(--spacing-4)]">
          <div>
            <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)] uppercase tracking-wider block mb-[var(--spacing-2)]">
              {lang === "ar" ? "الأقسام المميزة" : "Featured Categories"}
            </span>
            <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)]">
              {sectionTitle}
            </h2>
          </div>

          <a
            href="/categories"
            className="inline-flex items-center gap-[var(--spacing-2)] text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-primary)] transition-all hover:opacity-80 group w-fit"
          >
            <span>{lang === "ar" ? "عرض كل التصنيفات" : "View All Categories"}</span>
            {isRTL ? (
              <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            ) : (
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-[var(--spacing-6)] sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.link}
              className="group relative block aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-[var(--radius-3xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-primary)]/40"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-[var(--ease-default)] group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
              
              <div className="absolute inset-x-0 bottom-0 p-[var(--spacing-6)] sm:p-[var(--spacing-8)] flex items-end justify-between">
                <h3 className="text-[var(--text-xl)] sm:text-[var(--text-2xl)] font-[var(--font-bold)] text-white tracking-tight">
                  {category.name}
                </h3>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:border-transparent">
                  {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}