import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import NavbarActions from "./NavbarActions";
import MobileMenu from "./MobileMenu";
import MobileMenuButton from "./MobileMenuButton";

import { useMenuLinks } from "@/features/navigation/hooks/useMenuLinks";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { slug } = useParams();
  const { isRTL } = useLang();

  const { menuLinks, isLoading, isFetching } = useMenuLinks("header");
  const isMenuLoading = isLoading || isFetching;

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="relative z-40 w-full border-b border-header-border bg-header/80 text-text-primary backdrop-blur-xl"
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Main row: Logo, navigation, actions */}
        <div className="flex min-h-16 min-w-0 items-center justify-between gap-3">
          {/* Logo */}
          <div className="min-w-0 shrink-0">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <DesktopMenu
              links={menuLinks}
              isLoading={isMenuLoading}
              currentSlug={slug}
            />
          </div>

          {/* Actions */}
          <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ms-0">
            <NavbarActions />

            {/* Mobile menu button */}
            <div className="shrink-0 lg:hidden">
              <MobileMenuButton
                isOpen={isOpen}
                onToggle={() => setIsOpen((previous) => !previous)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      <MobileMenu
        isOpen={isOpen}
        onClose={closeMobileMenu}
        links={menuLinks}
        isLoading={isMenuLoading}
        currentSlug={slug}
      />
    </header>
  );
}