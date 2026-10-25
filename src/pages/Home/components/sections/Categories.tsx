// src/pages/Home/components/sections/Categories.tsx

import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Container } from "@/shared/components/layout/Container";

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
      className="w-full py-16 bg-background"
    >
      <Container>
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-2">
              {lang === "ar" ? "الأقسام المميزة" : "Featured Categories"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {sectionTitle}
            </h2>
          </div>

          <a
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:opacity-80 group w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-control"
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.link}
              className="group relative block aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-panel bg-surface border border-border shadow-xs transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-[var(--ease-default)] group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Cinematic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {category.name}
                </h3>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-transparent">
                  {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </span>
              </div>
            </a>
          ))}
        </div>

      </Container>
    </section>
  );
}