// src/pages/Home/components/sections/CollectionHero.tsx

import { Link } from "react-router-dom";
import type { Section } from "@/features/cms/section/model/types/section.types";
import { normalizeNullable } from "@/shared/utils/normalizeNullable";

interface CollectionHeroProps {
  section: Section<string>;
}

export function CollectionHero({ section }: CollectionHeroProps) {
  // القراءة الصحيحة لبيانات القسم من section.data
  const rawData = section?.data;
  const item = Array.isArray(rawData) ? rawData[0] : rawData;

  // إذا لم نجد العنصر داخل data لا نقوم برندر القالب
  if (!item) return null;

  const title = normalizeNullable(item.title);
  const subtitle = normalizeNullable(item.subtitle);
  const description = normalizeNullable(item.description);

  const buttonText = normalizeNullable(item.button_text);
  const actionText = normalizeNullable(item.action_text);

  const floatTitle = normalizeNullable(item.float_title);
  const floatSubtitle = normalizeNullable(item.float_subtitle);

  const statNumber = normalizeNullable(item.stat_number);
  const statText = normalizeNullable(item.stat_text);

  const image = normalizeNullable(item.image);

  const link = normalizeNullable(item.link) ?? "/products";

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] max-h-[850px] overflow-hidden rounded-[var(--radius-2xl)] border border-border shadow-xl group">
      {/* Background Image with Cinematic Filter */}
      {image && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={image}
            alt={title || "Collection Hero Background"}
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-[var(--ease-default)] group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Floating Badge */}
      {(floatTitle || floatSubtitle) && (
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12 z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-panel px-6 py-3 text-white shadow-lg">
          {floatTitle && (
            <span className="block text-xs uppercase tracking-wider font-semibold text-primary">
              {floatTitle}
            </span>
          )}
          {floatSubtitle && <span className="block text-sm font-bold">{floatSubtitle}</span>}
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 sm:p-12 lg:p-16 max-w-4xl">
        {/* Title, Subtitle & Description */}
        <div className="flex flex-col gap-4 mb-8">
          {title && (
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-md">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-base sm:text-xl font-normal text-gray-200 leading-relaxed max-w-[640px] drop-shadow">
              {subtitle}
            </p>
          )}

          {description && (
            <p className="text-sm sm:text-base text-gray-300 max-w-[580px] drop-shadow line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Stats Section */}
        {(statNumber || statText) && (
          <div className="flex items-center gap-4 mb-6 text-white">
            {statNumber && (
              <span className="text-3xl font-extrabold text-primary">
                {statNumber}
              </span>
            )}
            {statText && <span className="text-sm text-gray-300 font-medium">{statText}</span>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          {buttonText && (
            <Link
              to={link}
              className="inline-flex items-center justify-center gap-3 rounded-card bg-primary px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:opacity-90 hover:scale-105 active:scale-100 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>{buttonText}</span>
              <svg
                className="w-5 h-5 transition-transform duration-[var(--duration-normal)] group-hover/btn:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          )}

          {actionText && (
            <Link
              to={link}
              className="inline-flex items-center justify-center rounded-card bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-white/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {actionText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}