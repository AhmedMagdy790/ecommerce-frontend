
import React, {
  type InputHTMLAttributes,
  forwardRef,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      endAdornment,
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? props.name;

    return (
      <div className={`flex w-full flex-col gap-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="px-1 text-xs font-semibold text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}

        <div className="group relative">
          {icon && (
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute start-3 top-1/2 z-10
                flex -translate-y-1/2 items-center justify-center
                text-text-muted
                group-focus-within:text-primary
              "
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error && inputId ? `${inputId}-error` : undefined}
            className={[
              "relative z-0 h-11 w-full rounded-[var(--radius-lg)] border",
              "bg-[var(--color-background)] text-sm text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-muted)] outline-none",
              "transition-all duration-[var(--duration-fast)]",
              "focus:border-[var(--color-primary)]",
              "focus:ring-2 focus:ring-[var(--color-primary)]/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-[var(--color-error)]"
                : "border-[var(--color-border)]",
              icon ? "ps-10" : "ps-4",
              endAdornment ? "pe-12" : "pe-4",
              className,
            ].join(" ")}
            {...props}
          />

          {endAdornment && (
            <div className="absolute inset-y-0 end-1 z-10 flex items-center justify-center">
              {endAdornment}
            </div>
          )}

          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0 rounded-[var(--radius-lg)]",
              "opacity-0 transition-opacity duration-200",
              "group-focus-within:opacity-100",
              error
                ? "shadow-[0_0_12px_rgb(var(--color-error-rgb)/0.12)]"
                : "shadow-[0_0_12px_rgb(var(--color-primary-rgb)/0.10)]",
            ].join(" ")}
          />
        </div>

        {error && (
          <span
            id={inputId ? `${inputId}-error` : undefined}
            role="alert"
            className="px-1 text-xs font-medium text-[var(--color-error)]"
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";