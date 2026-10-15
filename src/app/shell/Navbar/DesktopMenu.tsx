// src/components/layout/DesktopMenu.tsx

import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import type { NavLinkItem, NavMenu } from "@/features/navigation/types/navigation.types";

interface DesktopMenuProps {
  links: NavMenu;
  isLoading: boolean;
  currentSlug?: string;
}

export default function DesktopMenu({ links, isLoading, currentSlug }: DesktopMenuProps) {
  const { isRTL } = useLang();
  const location = useLocation();

  // 1. حالة التحميل (Skeleton Loader)
  if (isLoading) {
    return (
      <div 
        className="hidden lg:flex items-center gap-[var(--spacing-1)] rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-[var(--spacing-1)] shadow-[var(--shadow-xs)]"
        aria-hidden="true"
      >
        <div className="w-20 h-8 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-full)]" />
        <div className="w-20 h-8 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-full)]" />
        <div className="w-20 h-8 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-full)]" />
      </div>
    );
  }

  const navItems = links?.items ?? [];

  // 2. التحقق الدقيق من مطابقة المسار النشط
  const isCustomActive = (item: NavLinkItem): boolean => {
    if (currentSlug) {
      const cleanHref = item.href.replace(/^\/|\/$/g, "");
      const cleanSlug = currentSlug.replace(/^\/|\/$/g, "");
      if (cleanHref === cleanSlug) return true;
    }
    return location.pathname === item.href;
  };

  const getButtonStyles = (isActive: boolean) =>
    `relative rounded-[var(--radius-full)] px-[var(--spacing-4)] xl:px-[var(--spacing-5)] py-[var(--spacing-2)] text-[var(--text-sm)] whitespace-nowrap transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] ${
      isActive
        ? "bg-[var(--color-background)] font-[var(--font-semibold)] text-[var(--color-text-primary)] shadow-[var(--shadow-xs)]"
        : "font-[var(--font-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]/50"
    }`;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="hidden lg:flex items-center gap-[var(--spacing-1)] rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-[var(--spacing-1)] shadow-[var(--shadow-xs)]"
    >
      {navItems.map((item) => {
        const customActive = isCustomActive(item);

        if (item.isExternal) {
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={getButtonStyles(false)}
              style={{
                fontFamily: isRTL ? "var(--font-arabic)" : "var(--font-sans)",
              }}
            >
              {item.title}
            </a>
          );
        }

        return (
          <NavLink
            key={item.id}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) => getButtonStyles(isActive || customActive)}
            style={{
              fontFamily: isRTL ? "var(--font-arabic)" : "var(--font-sans)",
            }}
          >
            {item.title}
          </NavLink>
        );
      })}
    </div>
  );
}