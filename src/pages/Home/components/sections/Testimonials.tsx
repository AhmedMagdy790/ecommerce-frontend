import { useTranslation } from "react-i18next";

// Define the domain type
interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  comment: string;
  rating: number;
}

// Flat Props: No 'data' wrapper
interface TestimonialsProps {
  title: string;
  testimonials: Testimonial[];
}

export default function Testimonials({ title, testimonials = [] }: TestimonialsProps) {
  const { t } = useTranslation("home");

  if (!testimonials.length) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <h2 className="mb-12 text-center text-3xl font-bold text-text-primary md:text-4xl">
          {t(title)}
        </h2>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <span key={index} className="text-yellow-500">
                    ★
                  </span>
                ))}
              </div>

              {/* Comment */}
              <p className="mb-6 leading-relaxed text-text-secondary">
                "{t(item.comment)}"
              </p>

              {/* Customer */}
              <div className="flex items-center gap-4">
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt={t(item.name)}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {t(item.name)}
                  </h3>
                  {item.role && (
                    <p className="text-sm text-text-secondary">
                      {t(item.role)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}