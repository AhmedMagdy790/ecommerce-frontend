import type React from "react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  isOpen: boolean;
  marginBelow?: number;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  portalId?: string;
}

const PORTAL_ROOT_ID = "dropdown-portal-root";
const VIEWPORT_MARGIN = 16;
const GAP = 8;

function getPortalContainer(portalId: string): HTMLElement {
  let container = document.getElementById(portalId);

  if (!container) {
    container = document.createElement("div");
    container.id = portalId;
    document.body.appendChild(container);
  }

  return container;
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
  const [portalContainer, setPortalContainer] =
    useState<HTMLElement | null>(null);

  // Create the portal only on the client.
  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      setPortalContainer(getPortalContainer(portalId));
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, portalId]);

  // Focus the first enabled menu item when the menu opens.
  useEffect(() => {
    if (!isOpen || !portalContainer) return;

    const frame = requestAnimationFrame(() => {
      const menu = dropdownRef.current;
      const firstItem = menu?.querySelector<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)',
      );

      firstItem?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, portalContainer]);

  // Position the dropdown and keep it within the viewport.
  useLayoutEffect(() => {
    if (!isOpen || !portalContainer) return;

    const updatePosition = () => {
      const dropdown = dropdownRef.current;
      const trigger = triggerRef?.current;

      if (!dropdown || !trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Center the dropdown horizontally relative to the trigger.
      let x = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2;

      // Prefer the right side for a trigger near the left edge,
      // and the left side for a trigger near the right edge.
      if (triggerRect.left < viewportWidth / 2) {
        x = Math.max(triggerRect.left, x);
      } else {
        x = Math.min(
          triggerRect.right - dropdownRect.width,
          x,
        );
      }

      // Keep the dropdown inside the viewport.
      x = Math.max(
        VIEWPORT_MARGIN,
        Math.min(
          x,
          viewportWidth - dropdownRect.width - VIEWPORT_MARGIN,
        ),
      );

      // Prefer below the trigger; flip above when necessary.
      const spaceBelow =
        viewportHeight -
        triggerRect.bottom -
        marginBelow -
        VIEWPORT_MARGIN;

      const spaceAbove =
        triggerRect.top - GAP - VIEWPORT_MARGIN;

      const shouldFlip =
        dropdownRect.height > spaceBelow &&
        spaceAbove > spaceBelow;

      let y = shouldFlip
        ? triggerRect.top - dropdownRect.height - GAP
        : triggerRect.bottom + marginBelow;

      const availableHeight = Math.max(
        120,
        shouldFlip ? spaceAbove : spaceBelow,
      );

      dropdown.style.maxHeight = `${Math.min(350, availableHeight)}px`;

      y = Math.max(
        VIEWPORT_MARGIN,
        Math.min(
          y,
          viewportHeight - dropdownRect.height - VIEWPORT_MARGIN,
        ),
      );

      dropdown.style.position = "fixed";
      dropdown.style.left = `${x}px`;
      dropdown.style.top = `${y}px`;
      dropdown.style.zIndex = "var(--z-dropdown, 1200)";
      dropdown.style.visibility = "visible";
    };

    updatePosition();

    const dropdown = dropdownRef.current;
    const trigger = triggerRef?.current;

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updatePosition)
        : null;

    if (dropdown) resizeObserver?.observe(dropdown);
    if (trigger) resizeObserver?.observe(trigger);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [
    isOpen,
    portalContainer,
    triggerRef,
    marginBelow,
    children,
  ]);

  // Close when the pointer interaction starts outside the menu and trigger.
  useEffect(() => {
    if (!isOpen || !portalContainer) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      const insideMenu = dropdownRef.current?.contains(target);
      const insideTrigger = triggerRef?.current?.contains(target);

      if (!insideMenu && !insideTrigger) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, portalContainer, onClose, triggerRef]);

  // Keyboard interaction for an ARIA menu.
  useEffect(() => {
    if (!isOpen || !portalContainer) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const menu = dropdownRef.current;
      if (!menu) return;

      const items = Array.from(
        menu.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)',
        ),
      ).filter((item) => item.tabIndex !== -1);

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        onClose();
        return;
      }

      if (!items.length) return;

      const currentIndex = items.indexOf(
        document.activeElement as HTMLElement,
      );

      const nextIndex = (() => {
        switch (event.key) {
          case "ArrowDown":
            return currentIndex < 0
              ? 0
              : (currentIndex + 1) % items.length;

          case "ArrowUp":
            return currentIndex < 0
              ? items.length - 1
              : (currentIndex - 1 + items.length) % items.length;

          case "Home":
            return 0;

          case "End":
            return items.length - 1;

          default:
            return null;
        }
      })();

      if (nextIndex === null) return;

      event.preventDefault();
      items[nextIndex].focus();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, portalContainer, onClose, triggerRef]);

  if (!isOpen || !portalContainer) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      role="menu"
      aria-orientation="vertical"
      className={`invisible fixed flex w-max min-w-52 max-w-[calc(100vw-2rem)] flex-col overflow-y-auto overscroll-contain rounded-panel border border-border bg-background text-text-primary shadow-xl ${className}`}
      style={{ maxHeight: 350 }}
    >
      {children}
    </div>,
    portalContainer,
  );
};