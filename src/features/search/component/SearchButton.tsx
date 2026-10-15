// src/components/layout/Search/SearchButton.tsx

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface SearchButtonProps {
  onClick?: () => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // الإغلاق عند الضغط على Escape أو الضغط خارج الإطار
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsExpanded(false);
    }
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (onClick && nextState) {
      onClick();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsExpanded(false);
    }
  };

  return (
    <div ref={containerRef} dir={isRTL ? "rtl" : "ltr"}>
      {/* 1. Full Width Search Overlay Bar */}
      {isExpanded && (
        <div className="absolute inset-0 z-50 flex items-center px-[var(--spacing-4)] bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)] animate-in fade-in slide-in-from-top-2 duration-200">
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto flex w-full max-w-[var(--container-xl)] items-center gap-[var(--spacing-3)]"
          >
            <Search size={20} className="text-[var(--color-text-muted)] shrink-0" />

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن منتجات، أقسام، أو ماركات..." : "Search products, categories, or brands..."}
              className="w-full bg-transparent border-none outline-none text-[var(--text-base)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-0"
              style={{
                fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Clear query"
              >
                <X size={16} />
              </button>
            )}

            {/* Close Overlay Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex h-9 items-center justify-center rounded-[var(--radius-lg)] px-[var(--spacing-3)] text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>
          </form>
        </div>
      )}

      {/* 2. Trigger Button (الموجود في Navbar) */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={t("buttons.search", "Search")}
        title={t("buttons.search", "Search")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all duration-[var(--duration-fast)] hover:scale-105 active:scale-95 hover:border-[var(--color-border-hover)]"
      >
        <Search size={18} strokeWidth={2.2} />
      </button>
    </div>
  );
}