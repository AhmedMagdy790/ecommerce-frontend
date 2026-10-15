// src/pages/Home/components/sections/Testimonials.tsx
import type { Section } from "@/features/cms/section/model/types/section.types";
import { useLang } from "@/shared/context/LanguageContext";

interface Testimonial {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  data?: {
    comment?: string;
    role?: string;
    rating?: number;
    [key: string]: any;
  };
}

interface TestimonialsProps {
  section: Section<string> & {
    data?: Testimonial[];
    items?: Testimonial[];
  };
}

export default function Testimonials({ section }: TestimonialsProps) {
  const { lang, isRTL } = useLang();

  const testimonials = section.data ?? section.items ?? [];

  if (!testimonials.length) return null;

  const sectionTitle = section.name || (lang === "ar" ? "آراء عملاؤنا المميزون" : "Customer Experiences");

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[var(--color-surface)] px-[var(--spacing-6)] py-[var(--spacing-20)]"
    >
      {/* Background Ambient Glow */}
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)] opacity-10 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-[var(--container-xl)]">
        
        {/* Section Header */}
        <div className="mx-auto mb-[var(--spacing-16)] max-w-2xl text-center">
          <div className="mb-[var(--spacing-4)] inline-flex items-center gap-[var(--spacing-2)] rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-background)] px-[var(--spacing-4)] py-[var(--spacing-1.5)] shadow-[var(--shadow-xs)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)]" />
            <span className="text-[var(--text-xs)] font-[var(--font-semibold)] uppercase tracking-wider text-[var(--color-primary)]">
              {lang === "ar" ? "آراء عملاؤنا المميزون" : "Customer Experiences"}
            </span>
          </div>

          <h2 className="text-[var(--text-3xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)] sm:text-[var(--text-4xl)]">
            {sectionTitle}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-[var(--spacing-8)] md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => {
            const authorName = item.title || "";
            const authorRole = item.data?.role || "";
            const commentText = item.data?.comment || "";
            const rating = Math.min(Math.max(item.data?.rating ?? 5, 1), 5);

            return (
              <div
                key={item.id || index}
                className="group flex flex-col justify-between rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-background)] p-[var(--spacing-8)] shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-xl)]"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="mb-[var(--spacing-4)] flex gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 fill-amber-500 text-amber-500"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Comment */}
                  {commentText && (
                    <p className="mb-[var(--spacing-8)] italic text-[var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
                      "{commentText}"
                    </p>
                  )}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-[var(--spacing-4)] border-t border-[var(--color-border)]/60 pt-[var(--spacing-4)]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={authorName || "Customer"}
                      className="h-12 w-12 rounded-full border border-[var(--color-border)] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] font-bold text-[var(--color-primary)]">
                      {authorName ? authorName.charAt(0) : "C"}
                    </div>
                  )}

                  <div>
                    {authorName && (
                      <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
                        {authorName}
                      </h3>
                    )}

                    {authorRole && (
                      <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                        {authorRole}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}