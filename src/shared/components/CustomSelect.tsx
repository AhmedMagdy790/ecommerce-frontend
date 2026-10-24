// src/shared/components/CustomSelect.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "../context/LanguageContext";

export type Option = {
  label: string;
  value: string | number | boolean | null;
  disabled?: boolean;
  [key: string]: unknown;
};

type Props = {
  value?: Option["value"] | Option["value"][];
  onChange: (value: Option["value"] | Option["value"][] | "") => void;
  label?: string;
  options: Option[];
  placeholder?: string;
  searchStatus?: boolean;
  error?: string;
  disabled?: boolean;
  isMulti?: boolean;
  renderOption?: (option: Option) => React.ReactNode; 
  renderSelectedOption?: (option: Option) => React.ReactNode;
};

export default function CustomSelect({
  value,
  onChange,
  renderOption,
  renderSelectedOption,
  label,
  options,
  placeholder = "Select...",
  searchStatus = true,
  error,
  disabled = false,
  isMulti = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { lang } = useLang();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});

  // تحديد الخيارات المحددة (سواء كانت قيمة مفردة أو مصفوفة)
  const selectedOptions = useMemo(() => {
    console.log("value selct", value)
    if (value === undefined || value === null || value === "") return [];
    if (isMulti && Array.isArray(value)) {
      return options?.filter((o) => value.map(String).includes(String(o.value).trim())) || [];
    }
    const found = options?.find((o) => String(o.value).trim() === String(value).trim());
    return found ? [found] : [];
  }, [options, value, isMulti]);

  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const estimatedDropdownHeight = 300; 
      const spaceBelow = windowHeight - rect.bottom;
      const isNearBottom = spaceBelow < estimatedDropdownHeight;

      setDropdownStyles({
        position: "fixed",
        ...(isNearBottom
          ? {
              bottom: `${windowHeight - rect.top + 8}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              zIndex: 99999,
            }
          : {
              top: `${rect.bottom + 8}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              zIndex: 99999,
            }),
      });
    }
  };

  useEffect(() => {
    if (open) {
      updateDropdownPosition();
      const handleResizeOrScroll = () => updateDropdownPosition();
      window.addEventListener("resize", handleResizeOrScroll);
      window.addEventListener("scroll", handleResizeOrScroll, true);
      return () => {
        window.removeEventListener("resize", handleResizeOrScroll);
        window.removeEventListener("scroll", handleResizeOrScroll, true);
      };
    }
  }, [open]);

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
      const target = e.target as Node;
      const dropdownEl = document.getElementById("custom-select-portal-dropdown");
      if (
        wrapperRef.current && 
        !wrapperRef.current.contains(target) && 
        (!dropdownEl || !dropdownEl.contains(target))
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: Option["value"]) => {
    if (isMulti) {
      const currentArray: Option["value"][] = Array.isArray(value) ? [...value] : [];
      const index = currentArray.findIndex((v) => String(v) === String(optionValue));
      
      if (index > -1) {
        currentArray.splice(index, 1); // إزالة إذا كانت موجودة مسبقاً
      } else {
        currentArray.push(optionValue); // إضافة إذا لم تكن موجودة
      }
      onChange(currentArray);
    } else {
      setOpen(false);
      setSearch("");
      onChange(String(value).trim() === String(optionValue).trim() ? "" : optionValue);
    }
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {/* Label */}
      {label && (
        <label
          className="text-xs font-semibold text-[var(--color-text-secondary)] px-1 mb-2 block"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={!!error}
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setDropdownStyles({});
            setOpen((prev) => !prev);
          }
        }}
        className={`
          w-full 
          min-h-[44px] 
          py-2
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
        <div className="flex items-center gap-2 flex-wrap truncate">
          {error && (
            <span
              className="w-2.5 h-2.5 rounded-full bg-[var(--color-error)] shrink-0 animate-pulse"
              title={error}
            />
          )}

          {selectedOptions.length > 0 ? (
            isMulti ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map((opt) => (
                  <span
                    key={String(opt.value)}
                    className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded text-xs font-medium"
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[var(--color-text-primary)] font-medium truncate">
                {renderSelectedOption ? renderSelectedOption(selectedOptions[0]) : selectedOptions[0].label}
              </span>
            )
          ) : (
            <span className="text-[var(--color-text-muted)] font-normal truncate">
              {placeholder}
            </span>
          )}
        </div>

        <svg
          className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-[var(--duration-normal)] shrink-0 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown via Portal */}
      {open &&
        createPortal(
          <div
            id="custom-select-portal-dropdown"
            style={dropdownStyles}
            className="
              bg-[var(--card-bg)] 
              border 
              border-[var(--color-border)] 
              rounded-[var(--radius-xl)] 
              shadow-[var(--shadow-lg)] 
              backdrop-blur-xl 
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

            <ul
              role="listbox"
              className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent"
            >
              {filteredOptions.length === 0 ? (
                <li
                  role="option"
                  aria-selected
                  className="px-3 py-3 text-xs text-[var(--color-text-muted)] text-center italic"
                >
                  {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                </li>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = isMulti
                    ? Array.isArray(value) && value.map(String).includes(String(option.value).trim())
                    : String(option.value).trim() === String(value).trim();
                  
                  const isDisabled = option.disabled;

                  return (
                    <li
                      key={String(option.value)}
                      onClick={() => {
                        if (isDisabled || option.value == null) return;
                        handleSelect(option.value);
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

                      {isSelected && (
                        <span className="text-[var(--color-primary)] text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body
        )}

      {/* Error Text */}
      {error && (
        <span className="text-xs text-[var(--color-error)] font-medium px-1 mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
}