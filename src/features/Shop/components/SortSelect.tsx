import { useTranslation } from "react-i18next";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  data: {
    options: SortOption[];
    value?: string;
  };
}

export default function SortSelect({
  data,
}: SortSelectProps) {

  const { t } = useTranslation("shop");

  return (
    <div className="flex items-center gap-3">

      <label
        htmlFor="sort"
        className="text-sm font-medium text-text-primary"
      >
        {t("sort.label")}
      </label>


      <select
        id="sort"
        defaultValue={data.value || ""}
        className="rounded-xl border border-border bg-surface px-4 py-2 text-text-primary outline-none focus:ring-2 focus:ring-primary"
      >

        {data.options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {t(option.label)}
          </option>
        ))}

      </select>

    </div>
  );
}