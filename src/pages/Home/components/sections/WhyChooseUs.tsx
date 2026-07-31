// src/pages/Home/components/sections/WhyChooseUs.tsx

import { localize } from "@/shared/utils/localize";
import { useLang } from "@/shared/context/LanguageContext";
import type { Section } from "../SectionRenderer";

interface FeatureItem {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  description?: {
    ar: string;
    en: string;
  };
  data?: {
    description?: {
      ar: string;
      en: string;
    };
    icon?: string;
  };
  icon?: string;
  image?: string;
}

interface WhyChooseUsProps {
  section: Section & {
    data?: FeatureItem[];
    items?: FeatureItem[];
  };
}

export default function WhyChooseUs({ section }: WhyChooseUsProps) {
  const { lang, isRTL } = useLang();


  // Extract raw items/data from backend section object
  const rawFeatures = section.data ?? section.items ?? [];

  if (!rawFeatures.length) return null;

  // Normalize structure in case description is nested under item.data
  const features = rawFeatures.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? item.data?.description,
    icon: item.icon ?? item.data?.icon,
    image: item.image,
  }));

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[var(--color-surface)] px-[var(--spacing-6)] py-[var(--spacing-20)]"
    >
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10 pointer-events-none blur-[140px] bg-[var(--color-primary)]" />

      <div className="relative mx-auto max-w-[var(--container-xl)]">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-[var(--spacing-16)]">
          <div className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-[var(--color-background)] border border-[var(--color-border)] shadow-[var(--shadow-xs)] mb-[var(--spacing-4)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)] tracking-wider uppercase">
              {lang === "ar" ? "لماذا نحن الأفضل" : "Why Choose Us"}
            </span>
          </div>

          <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight">
            {localize(section.name, lang)}
          </h2>
        </div>

        {/* Features Grid with Modern Glassmorphic & Hover Elevation Effects */}
        <div className="grid gap-[var(--spacing-8)] md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const mediaSource = feature.icon ?? feature.image;

            return (
              <div
                key={feature.id}
                className="group relative flex flex-col items-center text-center rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--spacing-8)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:-translate-y-2 hover:shadow-[var(--shadow-xl)] hover:border-[var(--color-primary)]/40"
              >
                {/* Decorative Step Number Accent */}
                <span className="absolute top-4 right-6 text-[var(--text-2xl)] font-[var(--font-bold)] text-[var(--color-border)] select-none transition-colors duration-300 group-hover:text-[var(--color-primary)]/20">
                  0{index + 1}
                </span>

                {mediaSource && (
                  <div className="mb-[var(--spacing-6)] flex h-16 w-16 items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] transition-transform duration-[var(--duration-normal)] group-hover:scale-110 group-hover:bg-[var(--color-primary)]/10">
                    <img
                      src={mediaSource}
                      alt={localize(feature.title, lang)}
                      className="h-8 w-8 object-contain transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                <h3 className="mb-[var(--spacing-3)] text-[var(--text-xl)] font-[var(--font-semibold)] text-[var(--color-text-primary)] tracking-tight">
                  {localize(feature.title, lang)}
                </h3>

                {feature.description && (
                  <p className="text-[var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
                    {localize(feature.description, lang)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}