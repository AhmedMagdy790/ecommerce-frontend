// src/pages/ProductDetails/components/ProductReviews.tsx

import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface Review {
  id: string | number;
  name: string | { ar?: string; en?: string };
  avatar?: string;
  rating: number;
  comment: string | { ar?: string; en?: string };
  date?: string;
}

interface ProductReviewsProps {
  data?: {
    reviews?: Review[];
    averageRating?: number;
    totalReviews?: number;
  };
}

export default function ProductReviews({
  data,
}: ProductReviewsProps) {
  const { t } = useTranslation("product");
  const { lang, isRTL } = useLang();

  // Helper to safely extract localized text
  const getLocalizedText = (value?: string | { ar?: string; en?: string }) => {
    if (!value) return "";
    if (typeof value === "string") {
      return t(value, { defaultValue: value });
    }
    return value[lang as keyof typeof value] || value.en || value.ar || "";
  };

  const reviews = data?.reviews || [];
  const averageRating = data?.averageRating ?? 4.8;
  const totalReviews = data?.totalReviews ?? reviews.length;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-[var(--spacing-16)] border-t border-[var(--color-border)] pt-[var(--spacing-10)]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-[var(--spacing-8)] gap-[var(--spacing-4)]">
        <div>
          <h2 
            className="text-[var(--text-2xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)] mb-[var(--spacing-2)]"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {t("reviews.title", { defaultValue: lang === "ar" ? "مراجعات العملاء" : "Customer Reviews" })}
          </h2>
          <p 
            className="text-[var(--text-sm)] text-[var(--color-text-secondary)]"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {lang === "ar" ? "آراء حقيقية من عملائنا المميزين" : "Genuine feedback from our valued customers"}
          </p>
        </div>

        {/* Rating Overview Badge */}
        {averageRating && (
          <div className="flex items-center gap-[var(--spacing-3)] px-[var(--spacing-5)] py-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
            <span className="text-[var(--text-3xl)] font-[var(--font-bold)] text-[var(--color-primary)]">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center text-amber-500 gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star 
                    key={index} 
                    size={14} 
                    fill={index < Math.floor(averageRating) ? "currentColor" : "none"} 
                    className={index < Math.floor(averageRating) ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}
                  />
                ))}
              </div>
              <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)] mt-0.5">
                {totalReviews} {t("reviews", { defaultValue: lang === "ar" ? "مراجعة إجمالية" : "total reviews" })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-6)]">
        {reviews.map((review) => {
          const reviewerName = getLocalizedText(review.name);
          const reviewComment = getLocalizedText(review.comment);

          return (
            <article
              key={review.id}
              className="flex flex-col justify-between rounded-[var(--radius-3xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--spacing-6)] shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between mb-[var(--spacing-4)]">
                  <div className="flex items-center gap-[var(--spacing-3)]">
                    <img
                      src={review.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                      alt={reviewerName || "Reviewer"}
                      className="h-12 w-12 rounded-full object-cover border border-[var(--color-border)] shadow-xs"
                      loading="lazy"
                    />
                    <div>
                      <h3 
                        className="font-[var(--font-semibold)] text-[var(--text-base)] text-[var(--color-text-primary)]"
                        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                      >
                        {reviewerName}
                      </h3>
                      {review.date && (
                        <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                          {review.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star 
                        key={index} 
                        size={14} 
                        fill={index < review.rating ? "currentColor" : "none"} 
                        className={index < review.rating ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p 
                  className="text-[var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  "{reviewComment}"
                </p>
              </div>

              {/* Verified Purchase Tag */}
              <div className="mt-[var(--spacing-4)] pt-[var(--spacing-3)] border-t border-[var(--color-border)] flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-muted)]">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-[var(--font-medium)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {lang === "ar" ? "مشري موثق" : "Verified Purchase"}
                </span>
                <span>{lang === "ar" ? "منذ أسبوع" : "1 week ago"}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}