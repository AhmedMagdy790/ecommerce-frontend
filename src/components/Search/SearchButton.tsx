import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchButtonProps {
  onClick?: () => void;
}

export default function SearchButton({
  onClick,
}: SearchButtonProps) {
  const { t } = useTranslation("common");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("buttons.search")}
      title={t("buttons.search")}
      className="
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        rounded-lg
        text-[var(--color-text-primary)]
        transition-colors
        duration-[var(--duration-fast)]
        hover:bg-[var(--color-surface)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--color-primary)]
      "
    >
      <Search
        size={20}
        aria-hidden="true"
      />
    </button>
  );
}