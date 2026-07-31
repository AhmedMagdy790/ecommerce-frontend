import { SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchEmptyProps {
  query: string;
}

export default function SearchEmpty({
  query,
}: SearchEmptyProps) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX
        size={48}
        className="mb-4 text-[var(--color-text-muted)]"
      />

      <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
        {t("search.noResults")}
      </h3>

      <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">
        {t("search.noResultsDescription", {
          query,
        })}
      </p>
    </div>
  );
}