import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface Brand {
  id: string;
  name: string;
  logo: string;
  link?: string;
}

interface BrandLogosProps {
  title: string;
  brands: Brand[];
}

export default function BrandLogos({ title, brands = [] }: BrandLogosProps) {
  const { t } = useTranslation("home");
  const { lang } = useLang();

  const getLocalizedText = (text: string) => {
    if (!text) return "";
    return t(text);
  };

  if (!brands.length) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[var(--container-xl)]">
        {/* Header */}
        <h2 className="mb-10 text-center text-3xl font-bold text-[var(--color-text-primary)] md:text-4xl">
          {getLocalizedText(title)}
        </h2>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <a
              key={brand.id}
              href={brand.link || "#"}
              className="flex h-24 items-center justify-center rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-background-surface)] p-5 transition hover:shadow-md"
            >
              <img
                src={brand.logo}
                alt={getLocalizedText(brand.name)}
                className="max-h-12 max-w-full object-contain grayscale transition hover:grayscale-0"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}