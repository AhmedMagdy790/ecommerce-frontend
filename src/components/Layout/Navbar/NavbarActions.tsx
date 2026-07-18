import { useState } from "react";

import CartButton from "./CartButton";
import LanguageSwitcher from "./LanguageSwitcher";
import ProfileButton from "./ProfileButton";
import ThemeSwitcher from "./ThemeSwitcher";

import SearchButton from "../../Search/SearchButton";
import SearchModal from "../../Search/SearchModal";
import WishlistButton from "./WishlistButton";

export default function NavbarActions() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <SearchButton
          onClick={() => setSearchOpen(true)}
        />

        <LanguageSwitcher />

        <ThemeSwitcher />

         <WishlistButton />

        <CartButton />

        <ProfileButton />
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}