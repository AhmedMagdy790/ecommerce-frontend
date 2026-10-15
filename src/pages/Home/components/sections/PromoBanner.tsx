// src/pages/Home/components/sections/PromoBanner.tsx
import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";

interface PromoBannerProps {
  section: Section<string> & {
    data?: any[];
    items?: any[];
  };
}

export default function PromoBanner({ section }: PromoBannerProps) {
  const { isRTL } = useLang();

  // دعم جلب العناصر سواء من data أو items مع حماية تامة
  const rawItems = section.data || section.items || [];
  
  if (!rawItems.length) return null;

  // تجهيز البيانات
  const banners = rawItems.map((item: any, index: number) => ({
    id: item.id || index,
    title: item.title || "",
    description: item.subtitle || item.description || "",
    image: item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    buttonText: item.button_text || item.button || (section.key?.includes("contact") ? (isRTL ? "أرسل رسالة" : "Send a Message") : ""),
    buttonLink: item.link || item.button_link || "#",
  }));

  return (
    <div className="space-y-[var(--spacing-8)]" dir={isRTL ? "rtl" : "ltr"}>
      {banners.map((banner) => (
        <section key={banner.id} className="px-[var(--spacing-6)] py-[var(--spacing-8)]">
          <div className="group relative mx-auto max-w-[var(--container-xl)] overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--color-border)] shadow-[var(--shadow-xl)] bg-[var(--color-surface)]">
            
            {/* Background Image with Cinematic Zoom Effect */}
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-[var(--ease-default)] group-hover:scale-105"
              loading="lazy"
            />

            {/* Advanced Multi-layer Cinematic Gradient Overlays (تدرج داكن قوي لضمان وضوح النصوص البيضاء) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
            <div className={`absolute inset-0 bg-gradient-to-${isRTL ? "l" : "r"} from-black/80 via-black/40 to-transparent`} />

            {/* Content Container */}
            <div className="relative z-10 flex min-h-[400px] flex-col justify-center p-[var(--spacing-8)] sm:p-[var(--spacing-12)] lg:p-[var(--spacing-16)] max-w-2xl">
              
              {/* العنوان: تم جعل اللون أبيض دائماً لأن التدرج خلفه داكن جداً */}
              {banner.title && (
                <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-5xl)] font-[var(--font-bold)] text-white tracking-tight leading-[1.1] mb-[var(--spacing-4)] drop-shadow-md">
                  {banner.title}
                </h2>
              )}

              {/* الوصف: نص أبيض ناعم بوضوح عالي */}
              {banner.description && (
                <p className="text-[var(--text-base)] sm:text-[var(--text-lg)] font-[var(--font-medium)] text-gray-200 leading-relaxed mb-[var(--spacing-8)] max-w-xl drop-shadow-sm">
                  {banner.description}
                </p>
              )}

              {/* زر التفاعل */}
              {banner.buttonText && (
                <div>
                  <a
                    href={banner.buttonLink}
                    className="inline-flex items-center justify-center gap-[var(--spacing-3)] rounded-[var(--radius-xl)] bg-[var(--color-primary)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-[var(--text-base)] font-[var(--font-bold)] text-white shadow-xl transition-all duration-[var(--duration-normal)] hover:bg-[var(--color-primary-hover)] hover:scale-105 active:scale-95"
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