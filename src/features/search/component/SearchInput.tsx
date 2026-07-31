import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, autoFocus = false }, ref) => {
    const { t } = useTranslation("common");

    return (
      <div className="relative">
        <Search
          size={20}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-[var(--color-text-muted)]
          "
          aria-hidden="true"
        />

        <input
          ref={ref}
          type="search"
          value={value}
          autoFocus={autoFocus}
          placeholder={t("search.placeholder")}
          aria-label={t("buttons.search")}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            border-[var(--color-border)]
            bg-[var(--color-background)]
            py-3
            pl-12
            pr-4
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]
            outline-none
            transition
            focus:border-[var(--color-primary)]
            focus:ring-2
            focus:ring-[var(--color-primary)]
          "
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;