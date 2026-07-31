import { useEffect, useMemo, useRef } from "react";
import { Search } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

const HeaderSearch = () => {
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const shortcut = useMemo(() => {
    return navigator.userAgent.includes("Mac") ? "⌘ K" : "Ctrl K";
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="relative transition-all duration-[var(--duration-normal)]">
        <Search
          size={18}
          className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />

        <input
          ref={inputRef}
          type="text"
          placeholder={t("header.search_placeholder")}
          className="
            h-11
            xl:w-[430px]
            w-full
            rounded-xl
            border
            border-[var(--color-border)]
            bg-[var(--color-background)]
            py-2.5
            ps-11
            pe-16
            text-sm
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]
            focus:border-[var(--color-primary)]
            focus:outline-none
            focus:ring-4
            focus:ring-[var(--color-primary)]/10
          "
        />

        <kbd
          className="
            absolute
            end-2.5
            top-1/2
            -translate-y-1/2
            rounded-md
            border
            border-[var(--color-border)]
            bg-[var(--color-surface-secondary)]
            px-2
            py-1
            text-xs
            text-[var(--color-text-muted)]
            select-none
          "
        >
          {shortcut}
        </kbd>
      </div>
    </form>
  );
};

export default HeaderSearch;