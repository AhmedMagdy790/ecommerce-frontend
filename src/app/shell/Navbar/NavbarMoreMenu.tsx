import { useRef, useState } from "react";
import { Ellipsis, Globe, Languages, Palette, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

import { Dropdown } from "@/shared/components/dashboard/ui/dropdown/Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import CountrySelector from "./CountrySelector";

export default function NavbarMoreMenu() {
  const { t } = useTranslation("common");
  const { isRTL } = useLang();

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeDropdown = () => setIsOpen(false);

  return (
    <div
      className="relative flex h-full shrink-0 items-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={t("navbar.moreOptions", "المزيد من الخيارات")}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={[
          "inline-flex size-10 shrink-0 items-center justify-center",
          "rounded-full border border-border",
          "bg-surface text-text-primary shadow-sm",
          "transition-all duration-200",
          "hover:border-primary hover:bg-surface-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "focus-visible:outline-primary",
          "active:scale-95",
          isOpen ? "border-primary bg-surface-hover" : "",
        ].join(" ")}
      >
        <Ellipsis size={20} aria-hidden="true" />
      </button>

      <Dropdown
        isOpen={isOpen}
        marginBelow={18}
        onClose={closeDropdown}
        triggerRef={buttonRef}
        className={[
          "z-[var(--z-dropdown)] flex w-[280px] max-w-[calc(100vw-24px)]",
          "flex-col rounded-2xl border border-border",
          "bg-background p-3 text-text-primary shadow-xl",
        ].join(" ")}
      >
        <div onClick={(e) => e.stopPropagation()} className="flex flex-col w-full">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm font-semibold">
              {t("navbar.displaySettings", "إعدادات العرض")}
            </span>

            <button
              type="button"
              onClick={closeDropdown}
              aria-label={t("close", "إغلاق")}
              className={[
                "inline-flex size-8 items-center justify-center",
                "rounded-control text-text-secondary",
                "transition-colors hover:bg-surface-hover",
                "hover:text-text-primary",
                "focus-visible:outline-2 focus-visible:outline-primary",
              ].join(" ")}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Language */}
          <div className="flex min-h-12 items-center justify-between gap-3">
            <span className="flex shrink-0 items-center gap-2 text-sm text-text-secondary">
              <Languages size={18} aria-hidden="true" />
              {t("navbar.language", "اللغة")}
            </span>

            <LanguageSwitcher />
          </div>

          {/* Country Selection */}
          <div className="flex min-h-12 items-center justify-between gap-3">
            <span className="flex shrink-0 items-center gap-2 text-sm text-text-secondary">
              <Globe size={18} aria-hidden="true" />
              {t("navbar.country", "الدولة")}
            </span>

            <CountrySelector />
          </div>

          <div aria-hidden="true" className="my-2 border-t border-border" />

          {/* Theme */}
          <div className="flex min-h-12 items-center justify-between gap-3">
            <span className="flex shrink-0 items-center gap-2 text-sm text-text-secondary">
              <Palette size={18} aria-hidden="true" />
              {t("navbar.appearance", "المظهر")}
            </span>

            <ThemeSwitcher />
          </div>
        </div>
      </Dropdown>
    </div>
  );
}