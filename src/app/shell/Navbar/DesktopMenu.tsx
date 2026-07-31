// src/components/layout/DesktopMenu.tsx

import { NavLink } from "react-router-dom";
import { NAV_LINKS } from "@/constants/navigation";
import { useLang } from "@/shared/context/LanguageContext";

export default function DesktopMenu() {
  const { lang, isRTL } = useLang();

  // Helper to extract localized label if it's an object or string
  const getLabel = (name: any) => {
    if (!name) return "";
    if (typeof name === "string") return name;
    return name[lang] || name.en || name.ar || "";
  };

  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className="hidden lg:flex items-center gap-[var(--spacing-1)] rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-[var(--spacing-1)] shadow-[var(--shadow-xs)]"
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          className={({ isActive }) =>
            `relative rounded-[var(--radius-full)] px-[var(--spacing-5)] py-[var(--spacing-2)] text-[var(--text-sm)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] ${
              isActive
                ? "bg-[var(--color-background)] font-[var(--font-semibold)] text-[var(--color-text-primary)] shadow-[var(--shadow-xs)]"
                : "font-[var(--font-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]/50"
            }`
          }
          style={{
            fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
          }}
        >
          {getLabel(link.name)}
        </NavLink>
      ))}
    </nav>
  );
}