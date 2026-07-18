import { useTranslation } from "react-i18next";

interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  date?: string;
}

interface ProductReviewsProps {
  data: {
    reviews: Review[];
    averageRating?: number;
    totalReviews?: number;
  };
}

export default function ProductReviews({
  data,
}: ProductReviewsProps) {

  const { t } = useTranslation("product");

  return (
    <section className="mt-16 border-t border-border pt-10">

      {/* Header */}
      <div className="mb-8">

        <h2 className="text-2xl font-bold text-text-primary">
          {t("reviews.title")}
        </h2>


        {data.averageRating && (
          <div className="mt-3 flex items-center gap-3">

            <span className="text-3xl font-bold text-primary">
              {data.averageRating}
            </span>

            <span className="text-yellow-500">
              ★★★★★
            </span>

            <span className="text-text-secondary">
              ({data.totalReviews})
            </span>

          </div>
        )}

      </div>



      {/* Reviews */}
      <div className="space-y-6">

        {data.reviews.map((review) => (

          <article
            key={review.id}
            className="rounded-2xl border border-border bg-surface p-6"
          >

            <div className="flex items-center gap-4">

              {review.avatar && (
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}


              <div>

                <h3 className="font-semibold text-text-primary">
                  {review.name}
                </h3>


                {review.date && (
                  <p className="text-sm text-text-secondary">
                    {review.date}
                  </p>
                )}

              </div>

            </div>



            {/* Rating */}
            <div className="mt-4 text-yellow-500">
              {"★".repeat(review.rating)}
            </div>



            {/* Comment */}
            <p className="mt-3 leading-relaxed text-text-secondary">
              {review.comment}
            </p>


          </article>

        ))}

      </div>


    </section>
  );
}