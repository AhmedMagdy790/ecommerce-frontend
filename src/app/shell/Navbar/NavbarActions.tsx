// src/components/layout/NavbarActions.tsx
import { useLang } from "@/shared/context/LanguageContext";
import CartButton from "./CartButton";
import LanguageSwitcher from "./LanguageSwitcher";
import ProfileButton from "./ProfileButton";
import ThemeSwitcher from "./ThemeSwitcher";
import SearchButton from "../../../features/search/component/SearchButton";
import WishlistButton from "./WishlistButton";

export default function NavbarActions() {
  const { lang, isRTL } = useLang();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex items-center gap-1.5 sm:gap-2.5 shrink-0"
    >
      {/* Search Button */}
      <SearchButton aria-label={lang === "ar" ? "بحث..." : "Search..."} />

      {/* Wishlist */}
      <WishlistButton />

      {/* Cart */}
      <CartButton />

      {/* Vertical Divider */}
      <div className="hidden md:block h-4 w-[1px] bg-[var(--color-border)] mx-1" />

      {/* Preferences (Language & Theme) */}
      <div className="hidden lg:flex items-center gap-1.5">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      {/* Vertical Divider */}
      <div className="hidden sm:block h-4 w-[1px] bg-[var(--color-border)] mx-1" />

      {/* Profile */}
      <ProfileButton />
    </div>
  );
}