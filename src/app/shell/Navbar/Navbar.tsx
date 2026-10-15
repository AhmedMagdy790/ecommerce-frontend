// src/components/layout/Navbar.tsx
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
  const { menuLinks, isLoading } = useMenuLinks("header");

  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full border-b transition-colors duration-normal backdrop-blur-xl bg-[var(--color-background)]/80 z-40"
      style={{
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--header-border)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[var(--container-2xl)] items-center justify-between px-4 sm:px-6 md:px-8 gap-4">
        
        {/* Left: Logo */}
        <Logo />

        {/* Center: Floating Navigation Menu */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
          <DesktopMenu
            links={menuLinks}
            isLoading={isLoading}
            currentSlug={slug}
          />
        </div>

        {/* Right: Actions & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <NavbarActions />

          <div className="lg:hidden ml-1">
            <MobileMenuButton
              isOpen={isOpen}
              onToggle={() => setIsOpen((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        links={menuLinks}
        isLoading={isLoading}
        currentSlug={slug}
      />
    </nav>
  );
}