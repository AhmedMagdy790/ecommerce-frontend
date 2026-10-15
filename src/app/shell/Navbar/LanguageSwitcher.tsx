import { Languages } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";
import { langKeys } from "@/shared/utils/langHelpers";
import { UI_STRINGS } from "@/locales/languages"; // ⭐ استيراد UI_STRINGS لجلب البيانات من config.json

export default function LanguageSwitcher() {
  const { lang, changeLanguage } = useLang();

  // دالة تبديل اللغة بشكل دائري بين اللغات المتاحة
  const handleToggle = () => {
    const currentIndex = langKeys.indexOf(lang);
    const nextIndex = (currentIndex + 1) % langKeys.length;
    changeLanguage(langKeys[nextIndex]);
  };

  const currentLangName = UI_STRINGS[lang]?._config?.nativeName || lang;

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
        {currentLangName}
      </span>
    </button>
  );
}