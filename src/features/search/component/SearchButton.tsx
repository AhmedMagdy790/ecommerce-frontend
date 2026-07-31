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

  // Focus input automatically when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    // Trigger external onClick handler (e.g. to open SearchModal) when expanding
    if (onClick && nextState) {
      onClick();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center" dir={isRTL ? "rtl" : "ltr"}>
      {/* Expandable Search Input Container */}
      <div
        className={`flex items-center transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] overflow-hidden ${
          isExpanded ? "w-64 sm:w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
        style={{
          position: isExpanded ? "relative" : "absolute",
          [isRTL ? "left" : "right"]: 0,
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="w-full flex items-center h-10 px-[var(--spacing-3)] rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]"
        >
          <Search size={16} className="text-[var(--color-text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث عن منتجات..." : "Search products..."}
            className="w-full bg-transparent border-none outline-none text-[var(--text-sm)] mx-[var(--spacing-2)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-0"
            style={{
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[var(--color-text-muted)] transition-opacity hover:opacity-80"
              aria-label="Clear query"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={t("buttons.search")}
        title={t("buttons.search")}
        className={`inline-flex items-center justify-center h-10 w-10 rounded-[var(--radius-xl)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] hover:scale-105 active:scale-95 ${
          isExpanded ? "ml-[var(--spacing-2)]" : ""
        } ${
          isExpanded 
            ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md" 
            : "bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]"
        }`}
      >
        {isExpanded ? <X size={18} strokeWidth={2.2} /> : <Search size={18} strokeWidth={2.2} />}
      </button>
    </div>
  );
}