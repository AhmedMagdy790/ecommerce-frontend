import { Languages } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useLang();

  const handleToggle = () => {
    changeLanguage(lang === "en" ? "ar" : "en");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Change language"
      className="inline-flex items-center transition-all duration-fast hover:scale-105 active:scale-95"
      style={{
        height: "40px",
        paddingLeft: "var(--spacing-3)",
        paddingRight: "var(--spacing-3)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-secondary)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
        gap: "var(--spacing-2)",
      }}
    >
      <Languages size={18} style={{ color: "var(--color-primary)" }} />

      <span
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: "var(--font-semibold)",
          fontFamily: "var(--font-sans)",
          textTransform: "uppercase",
        }}
      >
        {lang === "ar" ? "العربية" : "English"}
      </span>
    </button>
  );
}