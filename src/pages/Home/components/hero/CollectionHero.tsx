import { useTranslation } from 'react-i18next';

interface CollectionHeroProps {
  categoryLabel: string;
  categorySlug: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionLink: string;
  imageSrc: string;
  imageAlt: string;
}

export function CollectionHero({
  categoryLabel,
  categorySlug,
  title,
  description,
  primaryActionLabel,
  primaryActionLink,
  imageSrc,
  imageAlt,
}: CollectionHeroProps) {
  const { t } = useTranslation("home");

  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-surface border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-12 md:py-20">
          <a href={`/category/${categorySlug}`} className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 hover:underline">
            {t(categoryLabel)}
          </a>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
            {t(title)}
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-md leading-relaxed">
            {t(description)}
          </p>
          <a
            href={primaryActionLink}
            className="w-fit px-8 py-3 bg-primary text-text-inverse rounded-full font-semibold hover:bg-primary-hover transition-all active:scale-95 shadow-md text-center"
          >
            {t(primaryActionLabel)}
          </a>
        </div>

        <div className="relative aspect-[4/3] md:aspect-auto bg-surface-secondary">
          <img
            src={imageSrc}
            alt={t(imageAlt)}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}