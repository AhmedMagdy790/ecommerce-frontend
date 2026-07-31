// src/pages/Home/components/sections/PromoBanner.tsx
import type { Section } from "../SectionRenderer";
import { useLang } from "@/shared/context/LanguageContext";

interface PromoBannerProps {
  section: Section & {
    data?: any[];
    items?: any[];
  };
}

export default function PromoBanner({ section }: PromoBannerProps) {
  const { lang, isRTL } = useLang();

  // Support section.data or items
  const rawItems = section.data || section.items || [];
  
  if (!rawItems.length) return null;

  // Helper to safely extract localized text
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return "";
    if (typeof textObj === "string") return textObj;
    return textObj[lang] || textObj.en || textObj.ar || "";
  };

  // Map backend items to banner props
  const banners = rawItems.map((item: any) => ({
    id: item.id,
    title: getLocalizedText(item.title),
    description: getLocalizedText(item.subtitle || item.description),
    image: item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30", // Fallback image placeholder
    buttonText: getLocalizedText(item.button_text || item.button),
    buttonLink: item.link || item.button_link || "#",
  }));

  return (
    <div className="space-y-[var(--spacing-8)]" dir={isRTL ? "rtl" : "ltr"}>
      {banners.map((banner) => (
        <section key={banner.id} className="px-[var(--spacing-6)] py-[var(--spacing-8)]">
          <div className="group relative mx-auto max-w-[var(--container-xl)] overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--color-border)] shadow-[var(--shadow-xl)]">
            
            {/* Background Image with Cinematic Zoom Effect */}
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
              loading="lazy"
            />

            {/* Advanced Multi-layer Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className={`absolute inset-0 bg-gradient-to-${isRTL ? "l" : "r"} from-black/70 via-black/30 to-transparent`} />

            {/* Content Container */}
            <div className="relative z-10 flex min-h-[400px] flex-col justify-center p-[var(--spacing-8)] sm:p-[var(--spacing-12)] lg:p-[var(--spacing-16)] text-[var(--color-text-inverse)] max-w-2xl">
              
              {/* Minimalist Glassmorphic Badge */}
              <div className="inline-flex items-center gap-[var(--spacing-2)] w-fit px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-[var(--spacing-6)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-white tracking-wider uppercase">
                  {lang === "ar" ? "عرض حصري خاص" : "Exclusive Special Offer"}
                </span>
              </div>

              <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-5xl)] font-[var(--font-bold)] text-white tracking-tight leading-[1.1] mb-[var(--spacing-4)]">
                {banner.title}
              </h2>

              {banner.description && (
                <p className="text-[var(--text-base)] sm:text-[var(--text-lg)] font-[var(--font-normal)] text-gray-200 leading-relaxed mb-[var(--spacing-8)] max-w-xl">
                  {banner.description}
                </p>
              )}

              {banner.buttonText && (
                <div>
                  <a
                    href={banner.buttonLink}
                    className="inline-flex items-center justify-center gap-[var(--spacing-3)] rounded-[var(--radius-xl)] bg-white px-[var(--spacing-8)] py-[var(--spacing-4)] text-[var(--text-base)] font-[var(--font-semibold)] text-gray-900 shadow-xl transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:bg-gray-100 hover:scale-105 active:scale-95"
                  >
                    <span>{banner.buttonText}</span>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

          </div>
        </section>
      ))}
    </div>
  );
}