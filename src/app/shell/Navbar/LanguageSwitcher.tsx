import { Languages, LoaderCircle } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";
import { langKeys } from "@/shared/utils/langHelpers";
import { UI_STRINGS } from "@/locales/languages";

export default function LanguageSwitcher() {
  const { lang, changeLanguage, isChangingLanguage } = useLang();

  const handleToggle = async () => {
    if (isChangingLanguage || langKeys.length < 2) return;

    const currentIndex = langKeys.indexOf(lang);
    const nextIndex = (currentIndex + 1) % langKeys.length;

    await changeLanguage(langKeys[nextIndex]);
  };

  const currentLangName = UI_STRINGS[lang]?._config?.nativeName || lang;

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      disabled={isChangingLanguage}
      aria-label="Change language"
      aria-busy={isChangingLanguage}
      className="inline-flex items-center transition-all duration-fast hover:scale-105 active:scale-95 disabled:cursor-wait disabled:opacity-70"
      style={{
        height: "40px",
        minWidth: "80px",
        paddingLeft: "var(--spacing-3)",
        paddingRight: "var(--spacing-3)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-secondary)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
        gap: "var(--spacing-2)",
      }}
    >
      {isChangingLanguage ? (
        <LoaderCircle
          size={18}
          className="animate-spin"
          aria-hidden="true"
          style={{ color: "var(--color-primary)" }}
        />
      ) : (
        <Languages
          size={18}
          aria-hidden="true"
          style={{ color: "var(--color-primary)" }}
        />
      )}

      <span
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: "var(--font-semibold)",
          fontFamily: "var(--font-sans)",
          textTransform: "uppercase",
        }}
      >
        {isChangingLanguage ? "..." : currentLangName}
      </span>
    </button>
  );
}