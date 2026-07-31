import type React from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  triggerRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Escape key press to close the dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle positioning and responsive behavior
  useEffect(() => {
    if (!isOpen || !triggerRef?.current) return;

    const handlePosition = () => {
      if (!dropdownRef.current || !containerRef.current || !triggerRef.current) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 16;

      const isRtl =
        document.documentElement.dir === "rtl" ||
        getComputedStyle(document.documentElement).direction === "rtl";

      // Mobile view (< 640px): Render as a centered modal
      if (viewportWidth < 640) {
        containerRef.current.style.position = "fixed";
        containerRef.current.style.inset = "0";
        containerRef.current.style.display = "flex";
        containerRef.current.style.alignItems = "center";
        containerRef.current.style.justifyContent = "center";

        const dropdown = dropdownRef.current;
        dropdown.style.position = "relative";
        dropdown.style.inset = "auto";
        dropdown.style.transform = "none";
        dropdown.style.width = "calc(100vw - 2rem)";
        dropdown.style.maxHeight = "calc(100vh - 4rem)";
        return;
      }

      // Desktop view: Position relative to the trigger element
      containerRef.current.style.position = "static";
      containerRef.current.style.display = "block";

      const toggleRect = triggerRef.current.getBoundingClientRect();
      const dropRect = dropdownRef.current.getBoundingClientRect();

      let x: number;
      let y = toggleRect.bottom + 12;

      if (isRtl) {
        x = toggleRect.right - dropRect.width;

        if (x < margin) {
          x = toggleRect.left;
        }
        if (x + dropRect.width > viewportWidth - margin) {
          x = viewportWidth - dropRect.width - margin;
        }
      } else {
        x = toggleRect.left;

        if (x + dropRect.width > viewportWidth - margin) {
          x = viewportWidth - dropRect.width - margin;
        }
        if (x < margin) {
          x = margin;
        }
      }

      if (y + dropRect.height > viewportHeight - margin) {
        y = toggleRect.top - dropRect.height - 12;
      }

      const dropdown = dropdownRef.current;
      dropdown.style.position = "fixed";
      dropdown.style.left = `${x}px`;
      dropdown.style.top = `${y}px`;
      dropdown.style.right = "auto";
      dropdown.style.bottom = "auto";
      dropdown.style.transform = "none";
    };

    requestAnimationFrame(handlePosition);
    window.addEventListener("resize", handlePosition);
    window.addEventListener("scroll", handlePosition, true);

    return () => {
      window.removeEventListener("resize", handlePosition);
      window.removeEventListener("scroll", handlePosition, true);
    };
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  // Safely get or create portal root
  let portalRoot = document.getElementById("dropdown-portal-root");
  if (!portalRoot) {
    portalRoot = document.createElement("div");
    portalRoot.id = "dropdown-portal-root";
    portalRoot.className = "z-[var(--z-modal-dropdown)]";
    document.body.appendChild(portalRoot);
  }

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[var(--z-modal-dropdown)] pointer-events-none"
    >
      {/* Backdrop for mobile */}
      <div className="md:hidden fixed inset-0 z-[var(--z-modal-backdrop-dropdown)] bg-gray-950/40 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto" />
      
      {/* Click outside to close */}
      <div
        className="fixed inset-0 z-[var(--z-modal-backdrop-dropdown)] pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Dropdown Content with custom scrollbar */}
      <div
        ref={dropdownRef}
        className={`pointer-events-auto relative z-[var(--z-modal-dropdown)] flex flex-col rounded-2xl sm:rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl sm:shadow-lg dark:border-[var(--color-border)] dark:bg-[var(--color-surface)] overflow-hidden max-h-[350px] overflow-y-auto custom-scrollbar ${className}`}
      >
        {children}
      </div>
    </div>,
    portalRoot
  );
};