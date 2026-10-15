import { NavLink } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import type { NavLinkItem, NavMenu } from "@/features/navigation/types/navigation.types";


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
];

export default function MobileMenu({
  isOpen,
  onClose,
  links,
  isLoading,
  currentSlug,
}: MobileMenuProps) {
  const { lang, isRTL } = useLang();

  if (!isOpen) return null;

  const navItems = links?.items ?? [];

  const isCustomActive = (item: NavLinkItem): boolean => {
    if (!currentSlug) return false;
    return item.href === `/${currentSlug}` || item.href.endsWith(`/${currentSlug}`);
  };

  const getButtonStyles = (isActive: boolean) => {
    const activeBorder = isRTL ? "border-r-4" : "border-l-4";

    return `px-6 py-3 text-sm transition-colors flex items-center justify-between ${
      isActive
        ? `bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold ${activeBorder} border-[var(--color-primary)]`
        : "font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-background-surface)] hover:text-[var(--color-primary)]"
    }`;
  };

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] shadow-lg lg:hidden">
      <nav className="flex flex-col py-4">
        {/* Main Navigation */}
        {isLoading ? (
          <div className="flex flex-col gap-2 px-6 py-2" aria-hidden="true">
            <div className="w-full h-8 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-md)]" />
            <div className="w-full h-8 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-md)]" />
            <div className="w-full h-8 bg-[var(--color-surface)] animate-pulse rounded-[var(--radius-md)]" />
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
                  style={{
                    fontFamily: isRTL ? "var(--font-arabic)" : "var(--font-sans)",
                  }}
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
                className={({ isActive }) => getButtonStyles(isActive || customActive)}
                style={{
                  fontFamily: isRTL ? "var(--font-arabic)" : "var(--font-sans)",
                }}
              >
                <span>{item.title}</span>
              </NavLink>
            );
          })
        )}

        {/* User Navigation (ثابتة ومحلية) */}
        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
          {USER_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={({ isActive }) => getButtonStyles(isActive)}
              style={{
                fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              }}
            >
              <span>{link.name[lang as keyof typeof link.name] || link.name.en}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}