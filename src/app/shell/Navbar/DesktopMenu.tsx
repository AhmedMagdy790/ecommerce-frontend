
import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import type {
  NavLinkItem,
  NavMenu,
} from "@/features/navigation/types/navigation.types";

interface DesktopMenuProps {
  links: NavMenu;
  isLoading: boolean;
  currentSlug?: string;
}

export default function DesktopMenu({
  links,
  isLoading,
  currentSlug,
}: DesktopMenuProps) {
  const { isRTL } = useLang();
  const location = useLocation();

  const navItems = links?.items ?? [];

  const normalizePath = (path: string): string =>
    path.trim().replace(/^\/+|\/+$/g, "");

  const isCustomActive = (item: NavLinkItem): boolean => {
    if (currentSlug) {
      const cleanHref = normalizePath(item.href);
      const cleanSlug = normalizePath(currentSlug);

      if (cleanHref === cleanSlug) {
        return true;
      }
    }

    return location.pathname === item.href;
  };

  const getButtonStyles = (isActive: boolean): string =>
    [
      "relative inline-flex items-center justify-center",
      "whitespace-nowrap rounded-full",
      "px-4 py-2 xl:px-5",
      "text-sm transition-colors duration-200",
      "focus-visible:outline-2 focus-visible:outline-offset-2",
      "focus-visible:outline-primary",
      isActive
        ? [
            "bg-background",
            "font-semibold text-text-primary",
            "shadow-xs",
          ].join(" ")
        : [
            "font-medium text-text-secondary",
            "hover:bg-surface-hover",
            "hover:text-text-primary",
          ].join(" "),
    ].join(" ");

  if (isLoading) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={[
          "hidden lg:flex items-center gap-1",
          "rounded-full border border-border",
          "bg-surface-secondary p-1 shadow-xs",
        ].join(" ")}
        aria-hidden="true"
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-8 w-20 animate-pulse rounded-full bg-surface"
          />
        ))}
      </div>
    );
  }

  return (
    <nav
      aria-label={isRTL ? "القائمة الرئيسية" : "Main navigation"}
      dir={isRTL ? "rtl" : "ltr"}
      className={[
        "hidden lg:flex items-center gap-1",
        "rounded-full border border-border",
        "bg-surface-secondary p-1 shadow-xs",
      ].join(" ")}
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
                fontFamily: isRTL
                  ? "var(--font-arabic)"
                  : "var(--font-sans)",
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
            className={({ isActive }) =>
              getButtonStyles(isActive || customActive)
            }
            style={{
              fontFamily: isRTL
                ? "var(--font-arabic)"
                : "var(--font-sans)",
            }}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}