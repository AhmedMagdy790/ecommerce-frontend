import { NavLink } from "react-router-dom";
import { NAV_LINKS } from "@/constants/navigation";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const USER_LINKS = [
  {
    nameKey: "nav.wishlist",
    fallbackName: "Wishlist",
    href: "/wishlist",
  },
  {
    nameKey: "nav.profile",
    fallbackName: "Profile",
    href: "/profile",
  },
  {
    nameKey: "nav.orders",
    fallbackName: "Orders",
    href: "/orders",
  },
];

export default function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {
  const { t } = useTranslation("common");

  if (!isOpen) return null;

  return (
    <div
      className="
        border-t
        border-[var(--color-border)]
        bg-[var(--color-background)]
        shadow-lg
        lg:hidden
      "
    >
      <nav className="flex flex-col py-4">
        {/* Main Navigation */}
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            onClick={onClose}
            className="
              px-6
              py-3
              text-sm
              font-medium
              text-[var(--color-text-secondary)]
              transition-colors
              hover:bg-[var(--color-background-surface)]
              hover:text-[var(--color-primary)]
            "
          >
            {link.name}
          </NavLink>
        ))}

        {/* User Navigation */}
        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
          {USER_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={onClose}
              className="
                px-6
                py-3
                text-sm
                font-medium
                text-[var(--color-text-secondary)]
                transition-colors
                hover:bg-[var(--color-background-surface)]
                hover:text-[var(--color-primary)]
              "
            >
              {t(link.nameKey, link.fallbackName)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}