
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useLang } from "@/shared/context/LanguageContext";
import type {
  NavLinkItem,
  NavMenu,
} from "@/features/navigation/types/navigation.types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavMenu;
  isLoading: boolean;
  currentSlug?: string;
}

const USER_LINKS = [
  {
    name: { ar: "المفضلة", en: "Wishlist" },
    href: "/wishlist",
  },
  {
    name: { ar: "الملف الشخصي", en: "Profile" },
    href: "/profile",
  },
  {
    name: { ar: "الطلبات", en: "Orders" },
    href: "/orders",
  },
] as const;

function normalizePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] ?? "";

  if (pathname === "/") return "/";

  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

export default function MobileMenu({
  isOpen,
  onClose,
  links,
  isLoading,
  currentSlug,
}: MobileMenuProps) {
  const { isRTL } = useLang();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = links?.items ?? [];

  const normalizedCurrentSlug = currentSlug
    ? normalizePath(currentSlug)
    : null;

  const isCustomActive = (item: NavLinkItem): boolean => {
    if (!normalizedCurrentSlug) return false;

    return (
      normalizePath(item.href) === normalizedCurrentSlug
    );
  };

  const getButtonStyles = (isActive: boolean): string =>
    [
      "flex w-full items-center justify-between",
      "border-s-4 px-6 py-3 text-sm",
      "transition-colors duration-200",
      "focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
      "focus-visible:outline-primary",
      isActive
        ? [
            "border-primary",
            "bg-primary-soft",
            "font-semibold text-primary",
          ].join(" ")
        : [
            "border-transparent",
            "font-medium text-text-secondary",
            "hover:bg-surface-hover",
            "hover:text-primary",
          ].join(" "),
    ].join(" ");

  const fontFamily = isRTL
    ? "var(--font-arabic)"
    : "var(--font-sans)";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={[
        "border-t border-border",
        "bg-background shadow-lg lg:hidden",
      ].join(" ")}
    >
      <nav
        aria-label={isRTL ? "القائمة الرئيسية" : "Main navigation"}
        className="flex flex-col py-4"
      >
        {/* Main Navigation */}
        {isLoading ? (
          <div
            className="flex flex-col gap-2 px-6 py-2"
            aria-hidden="true"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-10 w-full animate-pulse rounded-md bg-surface"
              />
            ))}
          </div>
        ) : (
          navItems.map((item) => {
            const customActive = isCustomActive(item);

            if (item.isExternal) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className={getButtonStyles(false)}
                  style={{ fontFamily }}
                >
                  <span>{item.title}</span>
                </a>
              );
            }

            return (
              <NavLink
                key={item.id}
                to={item.href}
                end={item.href === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  getButtonStyles(isActive || customActive)
                }
                style={{ fontFamily }}
              >
                <span>{item.title}</span>
              </NavLink>
            );
          })
        )}

        {/* User Navigation */}
        <div className="mt-4 border-t border-border pt-4">
          {USER_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={({ isActive }) =>
                getButtonStyles(isActive)
              }
              style={{ fontFamily }}
            >
              <span>{isRTL ? link.name.ar : link.name.en}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}