import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopFiltersProps {
  data: {
    categories: Category[];
    price: {
      min: number;
      max: number;
    };
  };
}

export default function ShopFilters({
  data,
}: ShopFiltersProps) {

  const { t } = useTranslation("shop");

  return (
    <aside className="space-y-8 rounded-2xl border border-border bg-surface p-6">

      {/* Categories */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t("filters.categories")}
        </h3>

        <div className="space-y-3">

          {data.categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                value={category.slug}
                className="h-4 w-4 rounded border-border"
              />

              <span className="text-text-secondary">
                {t(category.name)}
              </span>

            </label>
          ))}

        </div>
      </div>


      {/* Price */}
      <div>

        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t("filters.price")}
        </h3>

        <div className="flex items-center gap-3">

          <input
            type="number"
            placeholder={String(data.price.min)}
            className="w-full rounded-lg border border-border px-3 py-2"
          />

          <span>-</span>

          <input
            type="number"
            placeholder={String(data.price.max)}
            className="w-full rounded-lg border border-border px-3 py-2"
          />

        </div>

      </div>


      {/* Apply */}
      <button
        className="w-full rounded-full bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover"
      >
        {t("filters.apply")}
      </button>


    </aside>
  );
}