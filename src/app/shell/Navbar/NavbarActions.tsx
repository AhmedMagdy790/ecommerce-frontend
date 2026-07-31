// src/components/layout/NavbarActions.tsx

import { useState } from "react";
import { useLang } from "@/shared/context/LanguageContext";

import CartButton from "./CartButton";
import LanguageSwitcher from "./LanguageSwitcher";
import ProfileButton from "./ProfileButton";
import ThemeSwitcher from "./ThemeSwitcher";

import SearchButton from "../../../features/search/component/SearchButton";
import SearchModal from "../../../features/search/component/SearchModal";
import WishlistButton from "./WishlistButton";

export default function NavbarActions() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { lang, isRTL } = useLang();

  return (
    <>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="flex items-center"
        style={{
          gap: "var(--spacing-3)",
          height: "100%",
        }}
      >
        <SearchButton
          onClick={() => setSearchOpen(true)}
          aria-label={lang === "ar" ? "بحث عن منتجات..." : "Search products..."}
        />

        <div className="h-5 w-[1px] bg-[var(--color-border)] mx-[var(--spacing-1)] hidden sm:block" />

        <LanguageSwitcher />

        <ThemeSwitcher />

        <WishlistButton />

        <CartButton />

        <div className="h-5 w-[1px] bg-[var(--color-border)] mx-[var(--spacing-1)] hidden sm:block" />

        <ProfileButton />
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}