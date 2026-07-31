import { useLang } from "@/shared/context/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageToggler() {
  const { lang, changeLanguage } = useLang();

  const toggleLanguage = () => {
    changeLanguage(lang === "en" ? "ar" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      title={lang === "en" ? "تبديل للغة العربية" : "Switch to English"}
      aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
      className="
        flex items-center justify-center
        size-11
        text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
        bg-[var(--color-background)] hover:bg-[var(--color-surface-secondary)]
        rounded-xl
        border border-[var(--color-border)] hover:border-[var(--color-border-hover)]
        transition-all duration-200
        active:scale-95
      "
    >
      <Languages size={18} />
      <span
        className="
          sr-only
        "
      >
        {lang === "en" ? "Switch to Arabic" : "Switch to English"}
      </span>
    </button>
  );
}