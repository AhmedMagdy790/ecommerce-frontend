import React, { type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "info" | "update";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  children,
  isLoading,
  leftIcon,
  rightIcon,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-lg)] transition-all duration-[var(--duration-fast)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer";

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover,var(--color-primary))] shadow-[var(--shadow-xs)] shadow-[var(--color-primary)]/20",
    secondary:
      "bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-border)]",
    outline:
      "border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)]",
    ghost:
      "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)]",
    danger:
      "bg-[var(--red-500)] text-white hover:bg-[var(--red-600)] shadow-[var(--shadow-xs)] shadow-[var(--red-500)]/20",
    update:
      "bg-amber-500 text-white hover:bg-amber-600 shadow-[var(--shadow-xs)] shadow-amber-500/20",
    info:
      "bg-blue-500 text-white hover:bg-blue-600 shadow-[var(--shadow-xs)] shadow-blue-500/20",
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Loading */}
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}

      {/* Content */}
      <span className={`${isLoading ? "opacity-70" : "opacity-100"} flex items-center gap-2`}>
        {!isLoading && leftIcon && <span className="w-4 h-4 shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="w-4 h-4 shrink-0">{rightIcon}</span>}
      </span>
    </button>
  );
};