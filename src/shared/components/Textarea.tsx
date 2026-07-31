import React, { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, containerClassName = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Textarea */}
          <textarea
            ref={ref}
            className={`
              w-full 
              min-h-[120px] 
              p-4 
              bg-[var(--color-background)] 
              border 
              ${error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"} 
              rounded-[var(--radius-lg)] 
              text-[var(--color-text-primary)] 
              placeholder-[var(--color-text-muted)]
              text-sm
              resize-none
              outline-none 
              transition-all 
              duration-[var(--duration-fast)]
              focus:border-[var(--color-primary)]
              focus:ring-2 
              focus:ring-[var(--color-primary)]/20
              disabled:opacity-50 
              disabled:cursor-not-allowed
              scrollbar-thin 
              scrollbar-thumb-[var(--color-border)] 
              scrollbar-track-transparent
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
                ? "shadow-[0_0_20px_rgba(var(--red-500-rgb),0.15)]" 
                : "shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)]"
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

Textarea.displayName = "Textarea";