// src/shared/components/dashboard/ui/dropdown/DropdownItem.tsx

import type React from "react";
import { Link } from "react-router-dom";

interface DropdownItemProps {
  /** Renders as a router link ('a'), a standard button ('button'), or custom action */
  tag?: "a" | "button";
  /** Destination route if rendered as a Link */
  to?: string;
  /** Primary click handler */
  onClick?: (e: React.MouseEvent) => void | Promise<void>;
  /** Secondary or cascading click handler */
  onItemClick?: (e: React.MouseEvent) => void | Promise<void>;
  /** Base CSS styles applied by default */
  baseClassName?: string;
  /** Additional CSS classes for custom overrides */
  className?: string;
  /** Content rendered inside the dropdown item */
  children: React.ReactNode;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

const DEFAULT_BASE_CLASSES =
  "flex items-center w-full gap-[var(--spacing-3,12px)] p-[var(--spacing-2,10px)] mt-1 rounded-[var(--radius-lg,8px)] text-[var(--text-sm,14px)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer group text-start bg-transparent border-none select-none";

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  to,
  onClick,
  onItemClick,
  baseClassName = DEFAULT_BASE_CLASSES,
  className = "",
  children,
  ariaLabel,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  // Unified click handler to support mouse, touch, and keyboard interactions reliably
  const handleAction = async (e: React.MouseEvent) => {
    // Prevent event bubbling to avoid triggering parent overlay closes prematurely
    e.stopPropagation();
    
    await onClick?.(e);
    await onItemClick?.(e);
  };

  // Render as a React Router Link
  if (tag === "a" && to) {
    return (
      <Link
        to={to}
        role="menuitem"
        aria-label={ariaLabel}
        className={combinedClasses}
        onClick={handleAction}
      >
        {children}
      </Link>
    );
  }

  // Render as a standard interactive Button
  return (
    <button
      type="button"
      role="menuitem"
      aria-label={ariaLabel}
      onClick={handleAction}
      className={combinedClasses}
    >
      {children}
    </button>
  );
};