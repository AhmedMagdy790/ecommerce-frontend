import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSidebar } from "@/app/providers/SidebarContext";
import { createPortal } from "react-dom";

interface BaseModelProps {
  isOpen: boolean;
  closeModal: () => void;
  isLoading?: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  maxWidth?: string;
}

export default function BaseModel({
  isOpen,
  closeModal,
  isLoading,
  title,
  description,
  children,
  action,
  maxWidth = "max-w-lg"
}: BaseModelProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [show, setShow] = useState(false);

  // Handle open/close animation
  useEffect(() => {
    let mountTimer: ReturnType<typeof setTimeout>;
    let animationTimer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      mountTimer = setTimeout(() => {
        setIsMounted(true);
        animationTimer = setTimeout(() => setShow(true), 10);
      }, 0);
    } else {
      animationTimer = setTimeout(() => {
        setShow(false);
        mountTimer = setTimeout(() => setIsMounted(false), 200);
      }, 0);
    }

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(animationTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  if (!isMounted) return null;

  return createPortal(
    <div
      onClick={closeModal}
      className={` 
        fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-3
        bg-black/60 backdrop-blur-md
        transition-all duration-200
        ${show ? "opacity-100" : "opacity-0"}
        ${isExpanded || isHovered ? "lg:ms-[290px]" : "lg:ms-[90px]"}
        ${isMobileOpen ? "ms-0" : "ms-0"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative px-4 sm:p-6 lg:p-8 w-full ${maxWidth}
          max-h-[90vh] flex flex-col
          rounded-[var(--radius-xl)]  
          bg-[var(--card-bg)]/85
          border border-[var(--color-border)]
          backdrop-blur-xl
          shadow-[var(--shadow-xl)]
          z-[var(--z-modal)]
          transition-all duration-200
          ${show ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}
        `}
      >
        {/* تدرج سفلي متطابق مع لون الـ Card */}
        <div className="pointer-events-none z-10 absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[var(--card-bg)] to-transparent" />

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="
            absolute 
            top-5 
            inset-e-5 
            w-10 
            h-10 
            rounded-full 
            bg-[var(--color-surface-secondary)] 
            hover:bg-[var(--color-border)] 
            transition-colors
            flex 
            items-center 
            justify-center
            shadow-[var(--shadow-xs)]
          "
          title="Close Modal"
        >
          <X size={20} className="text-[var(--color-text-primary)]" />
        </button>

        {/* Header */}
        <div className="mb-4 shrink-0 pe-10">
          <h4 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)]">
            {title}
          </h4>
          {description && (
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <div
          className={`
            flex-1 overflow-y-auto
            pe-2
            scrollbar-thin scrollbar-thumb-[var(--color-border)]
            scrollbar-track-transparent
            transition
            ${isLoading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {children}
        </div>

        {/* Action Footer */}
        {action && (
          <div className="flex gap-4 justify-end shrink-0 border-t border-[var(--color-border)] mt-4 pt-4">
            {action}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}