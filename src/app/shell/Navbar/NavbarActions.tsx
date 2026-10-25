import { useLang } from "@/shared/context/LanguageContext";

import CartButton from "./CartButton";
import ProfileButton from "./ProfileButton";
import SearchButton from "../../../features/search/component/SearchButton";
import WishlistButton from "./WishlistButton";
import NavbarMoreMenu from "./NavbarMoreMenu";

export default function NavbarActions() {
  const { lang, isRTL } = useLang();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex shrink-0 items-center gap-1 sm:gap-1.5"
    >
      <SearchButton
        aria-label={lang === "ar" ? "بحث" : "Search"}
      />

      <WishlistButton />

      <CartButton />

      <div
        aria-hidden="true"
        className="mx-0.5 hidden h-5 w-px bg-border sm:block"
      />

      <ProfileButton />

      <NavbarMoreMenu />
    </div>
  );
}