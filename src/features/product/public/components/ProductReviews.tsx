// src/pages/ProductDetails/components/ProductReviews.tsx

import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

export interface Review {
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
      className="mt-16 border-t border-border pt-10 bg-background"
    >
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 
              className="text-2xl font-bold tracking-tight text-text-primary mb-2"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("reviews.title", { defaultValue: lang === "ar" ? "مراجعات العملاء" : "Customer Reviews" })}
            </h2>
            <p 
              className="text-sm text-text-secondary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {lang === "ar" ? "آراء حقيقية من عملائنا المميزين" : "Genuine feedback from our valued customers"}
            </p>
          </div>

          {/* Rating Overview Badge */}
          {averageRating && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-card bg-surface border border-border shadow-xs">
              <span className="text-3xl font-bold text-primary">
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
                <span className="text-xs text-text-secondary mt-0.5">
                  {totalReviews} {t("reviews", { defaultValue: lang === "ar" ? "مراجعة إجمالية" : "total reviews" })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => {
            const reviewerName = getLocalizedText(review.name);
            const reviewComment = getLocalizedText(review.comment);

            return (
              <article
                key={review.id}
                className="flex flex-col justify-between rounded-panel border border-border bg-surface p-6 shadow-xs transition-all hover:shadow-md"
              >
                <div>
                  {/* Author Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                        alt={reviewerName || "Reviewer"}
                        className="h-12 w-12 rounded-full object-cover border border-border shadow-xs"
                        loading="lazy"
                      />
                      <div>
                        <h3 
                          className="font-semibold text-base text-text-primary"
                          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                        >
                          {reviewerName}
                        </h3>
                        {review.date && (
                          <p className="text-xs text-text-muted">
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
                    className="text-sm leading-relaxed text-text-secondary"
                    style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                  >
                    "{reviewComment}"
                  </p>
                </div>

                {/* Verified Purchase Tag */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {lang === "ar" ? "مشري موثق" : "Verified Purchase"}
                  </span>
                  <span>{lang === "ar" ? "منذ أسبوع" : "1 week ago"}</span>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}