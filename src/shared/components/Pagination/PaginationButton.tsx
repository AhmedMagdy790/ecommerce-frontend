// src/shared/components/Pagination/PaginationButton.tsx
import React, { type ReactNode } from "react";

interface PaginationButtonProps {
  disabled: boolean;
  onClick: () => void;
  icon: ReactNode;
  ariaLabel: string;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({
  disabled,
  onClick,
  icon,
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 border border-[var(--color-border)] bg-[var(--color-background)] rounded-[var(--radius-md)] text-[var(--color-text-secondary)] disabled:opacity-50 transition-colors hover:bg-[var(--color-surface-secondary)]"
    >
      {icon}
    </button>
  );
};