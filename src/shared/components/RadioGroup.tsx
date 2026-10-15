// src/shared/components/RadioGroup.tsx

import React, { forwardRef } from "react";

export interface RadioOption {
  label: string | React.ReactNode;
  value: string | number;
  description?: string | React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode; // 🟢 Added icon support
}

interface RadioGroupProps {
  label?: string;
  error?: string;
  options: RadioOption[];
  value?: string | number | null;
  onChange: (value: string | number) => void;
  name?: string;
  containerClassName?: string;
  optionClassName?: string;
  direction?: "row" | "column";
  variant?: "card" | "minimal" | "pill" | "bordered";
  allowDeselect?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      error,
      options,
      value,
      onChange,
      name = "radio-group",
      containerClassName = "",
      optionClassName = "",
      direction = "column",
      variant = "card",
      allowDeselect = true,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`flex flex-col gap-2 w-full ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1">
            {label}
          </label>
        )}

        {/* Options container */}
        <div
          className={`flex ${
            direction === "row" ? "flex-row flex-wrap gap-3" : "flex-col gap-3"
          }`}
        >
          {options.map((option) => {
            const isSelected =
              value !== undefined &&
              value !== null &&
              value !== "" &&
              String(value) === String(option.value);

            // Style variations
            let variantStyles = "";
            if (variant === "card") {
              variantStyles = `
                rounded-[var(--radius-lg)] border p-4 items-start
                ${
                  isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[0_0_15px_rgb(var(--color-primary-rgb)/0.08)]"
                    : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)]/50"
                }
              `;
            } else if (variant === "minimal") {
              variantStyles = `
                rounded-[var(--radius-md)] p-3 items-center border border-transparent
                ${
                  isSelected
                    ? "bg-[var(--color-surface)] text-[var(--color-primary)] font-medium"
                    : "hover:bg-[var(--color-surface)]/50 text-[var(--color-text-primary)]"
                }
              `;
            } else if (variant === "pill") {
              variantStyles = `
                rounded-full px-5 py-2.5 border items-center justify-center transition-all cursor-pointer
                ${
                  isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md"
                    : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/50"
                }
              `;
            } else if (variant === "bordered") {
              variantStyles = `
                rounded-[var(--radius-lg)] border-2 p-4 items-center
                ${
                  isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-[var(--color-border)] bg-transparent hover:border-[var(--color-text-muted)]"
                }
              `;
            }

            return (
              <label
                key={option.value}
                className={`
                  relative
                  flex
                  cursor-pointer
                  gap-3
                  transition-all
                  duration-[var(--duration-fast)]
                  ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${variantStyles}
                  ${optionClassName}
                `}
              >
                {/* Radio Input */}
                {variant !== "pill" && (
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={isSelected}
                    disabled={option.disabled}
                    onChange={() => onChange(option.value)}
                    className="mt-1 h-4 w-4 accent-[var(--color-primary)] cursor-pointer disabled:cursor-not-allowed"
                  />
                )}

                {/* Content wrapper with icon support */}
                <div className="flex-1 flex items-center gap-3">
                  {option.icon && (
                    <div className="flex-shrink-0 text-[var(--color-primary)]">
                      {option.icon}
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <span className={`text-sm ${variant === "pill" && isSelected ? "font-semibold text-white" : "font-medium text-[var(--color-text-primary)]"}`}>
                      {option.label}
                    </span>
                    {option.description && variant !== "pill" && (
                      <span className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Transparent overlay layer for deselection / full card click */}
                <div
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={(e) => {
                    if (option.disabled) return;

                    if (allowDeselect && isSelected) {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange("");
                    }
                  }}
                />
              </label>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <span className="text-xs text-[var(--color-error)] font-medium px-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";