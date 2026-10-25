import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface SearchButtonProps {
  "aria-label"?: string;
}

export default function SearchButton({
  "aria-label": ariaLabel,
}: SearchButtonProps) {
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const closeSearch = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) {
      inputRef.current?.focus();
      return;
    }

    closeSearch();
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={ariaLabel ?? t("buttons.search", "Search")}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-control border border-border bg-surface-secondary text-text-primary transition-colors hover:border-border-hover hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Search size={19} aria-hidden="true" />
      </button>

      {isOpen &&
        createPortal(
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="fixed inset-0 z-[var(--z-modal,1300)] flex items-start justify-center overflow-y-auto bg-black/40 px-3 pt-[12vh] backdrop-blur-sm sm:px-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeSearch();
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="site-search-title"
              className="w-full max-w-2xl overflow-hidden rounded-panel border border-border bg-background text-text-primary shadow-xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
                <h2
                  id="site-search-title"
                  className="text-base font-semibold"
                >
                  {lang === "ar" ? "البحث في المتجر" : "Search the store"}
                </h2>

                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label={lang === "ar" ? "إغلاق البحث" : "Close search"}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-control text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <X size={19} aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit} role="search" className="p-4 sm:p-5">
                <label htmlFor="site-search-input" className="sr-only">
                  {lang === "ar" ? "ابحث عن المنتجات" : "Search products"}
                </label>

                <div className="flex min-w-0 items-center gap-2 rounded-control border border-border bg-surface-secondary p-2 focus-within:border-primary">
                  <Search
                    size={20}
                    className="ms-1 shrink-0 text-text-muted"
                    aria-hidden="true"
                  />

                  <input
                    ref={inputRef}
                    id="site-search-input"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={
                      lang === "ar"
                        ? "ابحث عن منتج..."
                        : "Search for a product..."
                    }
                    className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted"
                    style={{
                      fontFamily:
                        lang === "ar"
                          ? "var(--font-arabic)"
                          : "var(--font-sans)",
                    }}
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      aria-label={lang === "ar" ? "مسح البحث" : "Clear search"}
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-surface-hover hover:text-text-primary"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}

                  <button
                    type="submit"
                    className="shrink-0 rounded-control bg-primary px-3 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-5"
                  >
                    {lang === "ar" ? "بحث" : "Search"}
                  </button>
                </div>
              </form>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}