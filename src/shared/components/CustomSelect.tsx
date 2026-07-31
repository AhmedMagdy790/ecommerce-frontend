import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "../context/LanguageContext";

type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: any;
};

type Props = {
  value?: string | number;
  onChange: (value: string | number) => void;
  label?: string;
  options: Option[];
  placeholder?: string;
  searchStatus?: boolean;
  error?: string;
  disabled?: boolean;
  renderOption?: (option: Option) => React.ReactNode; 
};

export default function CustomSelect({
  value,
  onChange,
  renderOption,
  label,
  options,
  placeholder = "Select...",
  searchStatus = true,
  error,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { lang } = useLang();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options?.find((o) => String(o.value) === String(value));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!options) return [];
    return options.filter((o) => {
      if (typeof o.label !== "string") return false;
      return o.label.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, options]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {/* Label */}
      {label && (
        <label 
            className="text-xs font-semibold text-[var(--color-text-secondary)] px-1 mb-2 block" 
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={!!error}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`
          w-full 
          h-11 
          px-4 
          bg-[var(--color-background)] 
          border 
          ${error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"} 
          rounded-[var(--radius-lg)] 
          text-sm 
          outline-none 
          transition-all 
          duration-[var(--duration-fast)]
          flex 
          items-center 
          justify-between
          hover:border-[var(--color-primary)]/50
          focus:border-[var(--color-primary)]
          focus:ring-2 
          focus:ring-[var(--color-primary)]/20
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={
            selectedOption
              ? "text-[var(--color-text-primary)] font-medium truncate"
              : "text-[var(--color-text-muted)] font-normal truncate"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <svg
          className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-[var(--duration-normal)] ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div 
          className="
            absolute 
            top-full 
            start-0 
            mt-1.5 
            w-full 
            bg-[var(--card-bg)] 
            border 
            border-[var(--color-border)] 
            rounded-[var(--radius-xl)] 
            shadow-[var(--shadow-lg)] 
            backdrop-blur-xl 
            z-50 
            overflow-hidden 
            animate-in 
            fade-in 
            zoom-in-95 
            duration-200
          "
        >
          {searchStatus && (
            <div className="p-2 border-b border-[var(--color-border)]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "ar" ? "بحث..." : "Search..."}
                className="
                  w-full 
                  h-9 
                  px-3 
                  bg-[var(--color-background)] 
                  border 
                  border-[var(--color-border)] 
                  rounded-[var(--radius-md)] 
                  text-xs 
                  text-[var(--color-text-primary)] 
                  placeholder-[var(--color-text-muted)] 
                  outline-none 
                  focus:border-[var(--color-primary)]
                  focus:ring-1 
                  focus:ring-[var(--color-primary)]/20
                "
              />
            </div>
          )}

          <ul role="listbox" className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent">
            {filteredOptions.length === 0 ? (
              <li role="option" aria-selected className="px-3 py-3 text-xs text-[var(--color-text-muted)] text-center italic">
                {lang === "ar" ? "لا توجد نتائج" : "No results found"}
              </li>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = String(option.value) === String(value);
                const isDisabled = option.disabled;

                return (
                  <li
                    key={option.value}
                    onClick={() => {
                      if (isDisabled) return;
                      setOpen(false);
                      setSearch("");
                      onChange(isSelected ? "" : option.value);
                    }}
                    className={`
                      px-3 
                      py-2.5 
                      text-xs 
                      rounded-[var(--radius-md)] 
                      cursor-pointer 
                      transition-colors 
                      flex 
                      items-center 
                      justify-between
                      ${
                        isSelected 
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold" 
                          : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)]"
                      }
                      ${isDisabled ? "opacity-50 cursor-not-allowed bg-[var(--color-surface-secondary)]/50" : ""}
                    `}
                  >
                    {renderOption ? renderOption(option) : <span>{option.label}</span>}
                    
                    {isSelected && <span className="text-[var(--color-primary)] text-xs font-bold">✓</span>}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Error */}
      {error && <span className="text-xs text-[var(--color-error)] font-medium px-1 mt-1 block">{error}</span>}
    </div>
  );
}