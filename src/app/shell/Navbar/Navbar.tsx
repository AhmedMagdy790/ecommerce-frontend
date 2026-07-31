import { useState } from "react";
import { useLang } from "@/shared/context/LanguageContext";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import NavbarActions from "./NavbarActions";
import MobileMenu from "./MobileMenu";
import MobileMenuButton from "./MobileMenuButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isRTL } = useLang();

  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full border-b transition-colors duration-normal backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--color-background)]/60"
      style={{
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--header-border)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{
          height: "var(--header-height)",
          maxWidth: "var(--container-2xl)",
          paddingLeft: "var(--spacing-6)",
          paddingRight: "var(--spacing-6)",
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <DesktopMenu />

        {/* Right Actions */}
        <NavbarActions />

        {/* Mobile Menu Button */}
        <MobileMenuButton
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      </div>

      {/* Mobile Navigation */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </nav>
  );
}