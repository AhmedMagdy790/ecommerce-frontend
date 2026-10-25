import type React from "react";
import { Link } from "react-router-dom";

interface DropdownItemProps {
  /** Renders as a router link or a standard button */
  tag?: "a" | "button";

  /** Destination route if rendered as a Link */
  to?: string;

  /** Primary click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void | Promise<void>;

  /** Secondary or cascading click handler */
  onItemClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void | Promise<void>;

  /** Base CSS styles applied by default */
  baseClassName?: string;

  /** Additional CSS classes */
  className?: string;

  /** Content rendered inside the item */
  children: React.ReactNode;

  /** Accessible name when the visible content is insufficient */
  ariaLabel?: string;

  /** Optional menu item role for use inside a proper ARIA menu */
  role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";

  /** Disable interaction */
  disabled?: boolean;
}

const DEFAULT_BASE_CLASSES =
  "group mt-1 flex w-full select-none items-center gap-3 rounded-control bg-transparent p-2.5 text-start text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  to,
  onClick,
  onItemClick,
  baseClassName = DEFAULT_BASE_CLASSES,
  className = "",
  children,
  ariaLabel,
  role,
  disabled = false,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();


  const handleAction = async (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    try {
      await onClick?.(event);
      await onItemClick?.(event);
    } catch (error) {
      console.error("DropdownItem action failed:", error);
    }
  };


  if (tag === "a" && to) {
    return (
      <Link
        to={to}
        role={role}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={combinedClasses}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }

          void handleAction(event);
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role={role}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(event) => void handleAction(event)}
      className={combinedClasses}
    >
      {children}
    </button>
  );
};