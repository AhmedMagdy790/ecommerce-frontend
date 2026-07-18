import { useState } from "react";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import NavbarActions from "./NavbarActions";
import MobileMenu from "./MobileMenu";
import MobileMenuButton from "./MobileMenuButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-border
        bg-background/80
        backdrop-blur-xl
        supports-[backdrop-filter]:bg-background/60
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[var(--header-height)]
          max-w-[var(--container-xl)]
          items-center
          justify-between
          px-4
          lg:px-6
        "
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
    </header>
  );
}