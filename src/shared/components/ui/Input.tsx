import React, { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, containerClassName = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Icon */}
          {icon && (
            <div
              className={`
                absolute 
                start-3 
                top-1/2 
                -translate-y-1/2 
                flex 
                items-center 
                justify-center
                text-[var(--color-text-muted)] 
                group-focus-within:text-[var(--color-primary)]
                transition-colors
              `}
            >
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            className={`
              w-full 
              h-11 
              bg-[var(--color-background)] 
              border 
              ${error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"} 
              rounded-[var(--radius-lg)] 
              text-[var(--color-text-primary)] 
              placeholder-[var(--color-text-muted)]
              text-sm
              outline-none 
              transition-all 
              duration-[var(--duration-fast)]
              focus:border-[var(--color-primary)]
              focus:ring-2 
              focus:ring-[var(--color-primary)]/20
              disabled:opacity-50 
              disabled:cursor-not-allowed
              ${icon ? "ps-10 pe-4" : "px-4"}
            `}
            {...props}
          />

          {/* Glow effect */}
          <div
            className={`
              pointer-events-none 
              absolute 
              inset-0 
              rounded-[var(--radius-lg)]
              opacity-0 
              group-focus-within:opacity-100
              transition-opacity 
              duration-200
              ${error 
                ? "shadow-[0_0_20px_rgb(var(--color-primary-rgb)/0.15)]" 
                : "shadow-[0_0_20px_rgb(var(--color-error-rgb)/0.15)]"
              }
            `}
          />
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

Input.displayName = "Input";