
import React, { type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "info"
  | "update";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const baseStyles = [
  "inline-flex items-center justify-center gap-2",
  "rounded-control font-medium",
  "transition-colors duration-150",
  "focus-visible:outline-2 focus-visible:outline-offset-2",
  "focus-visible:outline-primary",
  "disabled:pointer-events-none disabled:opacity-50",
  "disabled:cursor-not-allowed",
].join(" ");

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-xs",
  md: "min-h-10 px-4 py-2 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-text-inverse shadow-sm hover:bg-primary-hover",
  secondary:
    "border border-border bg-surface-secondary text-text-primary hover:bg-surface-hover",
  outline:
    "border border-border bg-transparent text-text-primary hover:bg-surface-hover",
  ghost:
    "bg-transparent text-text-primary hover:bg-surface-hover",
  danger:
    "bg-error text-white hover:bg-error/90",
  update:
    "bg-amber-500 text-white hover:bg-amber-600",
  info:
    "bg-blue-500 text-white hover:bg-blue-600",
};

export const Button = ({
  children,
  isLoading = false,
  leftIcon,
  rightIcon,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={[
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isLoading ? (
        <Loader2
          aria-hidden="true"
          className="h-4 w-4 shrink-0 animate-spin"
        />
      ) : (
        leftIcon && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {leftIcon}
          </span>
        )
      )}

      <span className={isLoading ? "opacity-80" : ""}>
        {children}
      </span>

      {!isLoading && rightIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

Button.displayName = "Button";
