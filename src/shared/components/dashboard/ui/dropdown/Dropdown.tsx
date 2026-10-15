// src/shared/components/dashboard/ui/dropdown/Dropdown.tsx

import type React from "react";
import { useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  /** Controls the visibility state of the dropdown */
  isOpen: boolean;

  /** Margin below */
  marginBelow?: number;
  /** Callback triggered when the dropdown should close */
  onClose: () => void;
  /** Content rendered inside the dropdown menu */
  children: React.ReactNode;
  /** Additional CSS classes for custom styling */
  className?: string;
  /** Reference to the trigger element used for positioning */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** Portal container ID (defaults to 'dropdown-portal-root') */
  portalId?: string;
}

const PORTAL_ROOT_ID = "dropdown-portal-root";
const VIEWPORT_MARGIN = 16;

/** Helper function to safely get or create portal container without React State */
function getPortalContainer(portalId: string): HTMLElement {
  let elem = document.getElementById(portalId);
  if (!elem) {
    elem = document.createElement("div");
    elem.id = portalId;
    document.body.appendChild(elem);
  }
  return elem;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  marginBelow = 8,
  onClose,
  children,
  className = "",
  triggerRef,
  portalId = PORTAL_ROOT_ID,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Navigation Control (Close on Escape key)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 2. Close on Outside Click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      const isOutsideTrigger = triggerRef?.current && !triggerRef.current.contains(target);

      if (isOutsideDropdown && isOutsideTrigger) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  // 3. Intelligent Dynamic Positioning (Supports RTL & Viewport Constraints)
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef?.current || !dropdownRef.current) return;

    const updatePosition = () => {
      const dropdown = dropdownRef.current;
      const trigger = triggerRef.current;
      if (!dropdown || !trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const isRTL =
        document.documentElement.dir === "rtl" ||
        getComputedStyle(document.documentElement).direction === "rtl";

      let x: number;
      let y = triggerRect.bottom + marginBelow; // Margin below trigger

      // Alignment check: if trigger is on the right side of the viewport
      const isTriggerOnRightSide = triggerRect.left > viewportWidth / 2;

      if (isRTL || isTriggerOnRightSide) {
        // Right alignment with trigger
        x = triggerRect.right - dropdownRect.width;
      } else {
        // Left alignment with trigger
        x = triggerRect.left;
      }

      // Viewport horizontal boundary enforcement
      if (x + dropdownRect.width > viewportWidth - VIEWPORT_MARGIN) {
        x = viewportWidth - dropdownRect.width - VIEWPORT_MARGIN;
      }
      if (x < VIEWPORT_MARGIN) {
        x = VIEWPORT_MARGIN;
      }

      // Vertical flip if overflow occurs at the bottom
      if (y + dropdownRect.height > viewportHeight - VIEWPORT_MARGIN) {
        y = triggerRect.top - dropdownRect.height - 8;
      }
      if (y < VIEWPORT_MARGIN) {
        y = VIEWPORT_MARGIN;
      }

      dropdown.style.position = "fixed";
      dropdown.style.left = `${x}px`;
      dropdown.style.top = `${y}px`;
      dropdown.style.zIndex = "var(--z-dropdown, 9999)";
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  // Render Portal directly without state triggers
  const portalContainer = getPortalContainer(portalId);

  return createPortal(
    <div
      ref={dropdownRef}
      role="menu"
      aria-orientation="vertical"
      className={`flex flex-col rounded-2xl sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl sm:shadow-lg dark:border-[var(--color-border)] dark:bg-[var(--color-surface)] overflow-hidden max-h-[350px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100 ${className}`}
    >
      {children}
    </div>,
    portalContainer
  );
};