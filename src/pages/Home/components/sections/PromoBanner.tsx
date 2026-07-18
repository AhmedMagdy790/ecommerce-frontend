import { useTranslation } from "react-i18next";

// 1. Props are now flat. 
interface PromoBannerProps {
  title: string;
  description: string;
  button?: string;
  buttonLink?: string;
  image: string;
  imageAlt?: string;
}

export default function PromoBanner({ 
  title, 
  description, 
  button, 
  buttonLink, 
  image, 
  imageAlt 
}: PromoBannerProps) {
  const { t } = useTranslation("home");

  return (
    <section className="px-6 py-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        {/* Background Image */}
        <img
          src={image}
          alt={imageAlt ? t(imageAlt) : ""}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[350px] flex-col justify-center px-8 text-white md:px-16">
          <h2 className="max-w-xl text-3xl font-bold md:text-5xl">
            {t(title)}
          </h2>

          <p className="mt-4 max-w-lg text-lg text-white/90">
            {t(description)}
          </p>

          {button && (
            <a
              href={buttonLink || "#"}
              className="mt-8 inline-flex w-fit rounded-full bg-white px-8 py-3 font-semibold text-gray-900 transition hover:bg-white/90 active:scale-95"
            >
              {t(button)}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}