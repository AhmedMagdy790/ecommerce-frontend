import { useTranslation } from "react-i18next";

// 1. Defined a domain type for cleaner code
interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

// 2. Flat Props: Removed the 'data' wrapper
interface WhyChooseUsProps {
  title: string;
  features: Feature[];
}

export default function WhyChooseUs({ title, features = [] }: WhyChooseUsProps) {
  const { t } = useTranslation("home");

  // Defensive guard clause
  if (!features.length) return null;

  return (
    <section className="bg-surface-secondary px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <h2 className="mb-12 text-center text-3xl font-bold text-text-primary md:text-4xl">
          {t(title)}
        </h2>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-2xl border border-border bg-surface p-6 text-center"
            >
              {/* Icon */}
              {feature.icon && (
                <div className="mb-5 flex justify-center">
                  <img
                    src={feature.icon}
                    alt=""
                    className="h-12 w-12"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Text */}
              <h3 className="mb-3 text-lg font-semibold text-text-primary">
                {t(feature.title)}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {t(feature.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}