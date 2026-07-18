// src/pages/Home/components/sections/Categories.tsx
import type { Category } from "@/types/category";
import { useTranslation } from "react-i18next";


interface CategoriesProps {
  title: string;
  categories: Category[];
}

export default function Categories({ title, categories = [] }: CategoriesProps) {
  const { t } = useTranslation("home");

  // Defensive check: If no categories exist, don't render an empty section
  if (!categories.length) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-3xl font-bold text-text-primary md:text-4xl">
          {t(title)}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.link || "#"}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-surface-secondary"
            >
              <img
                src={category.image}
                alt={t(category.name)}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/20 transition duration-300 group-hover:bg-black/30" />
              
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold text-white">
                  {t(category.name)}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}