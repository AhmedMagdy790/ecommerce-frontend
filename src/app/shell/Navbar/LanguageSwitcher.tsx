import { Languages, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { langKeys } from "@/shared/utils/langHelpers";
import { UI_STRINGS } from "@/locales/languages";

export default function LanguageSwitcher() {
  const { t } = useTranslation("common");
  const { lang, changeLanguage, isChangingLanguage } = useLang();

  const canChangeLanguage = langKeys.length > 1;

  const handleToggle = async () => {
    if (isChangingLanguage || !canChangeLanguage) return;

    const currentIndex = langKeys.indexOf(lang);
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % langKeys.length;

    await changeLanguage(langKeys[nextIndex]);
  };

  const currentLangName = UI_STRINGS[lang]?._config?.nativeName ?? lang;

  const nextLangIndex =
    langKeys.indexOf(lang) === -1
      ? 0
      : (langKeys.indexOf(lang) + 1) % langKeys.length;

  const nextLang = langKeys[nextLangIndex];
  const nextLangName =
    UI_STRINGS[nextLang]?._config?.nativeName ?? nextLang;

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      disabled={isChangingLanguage || !canChangeLanguage}
      aria-label={t("language.changeTo", {
        language: nextLangName,
        defaultValue: `Change language to ${nextLangName}`,
      })}
      aria-busy={isChangingLanguage}
      title={t("language.current", {
        language: currentLangName,
        defaultValue: `Current language: ${currentLangName}`,
      })}
      className="inline-flex h-10 min-w-20 items-center justify-center gap-2 rounded-control border border-border bg-surface-secondary px-3 text-text-primary transition-colors hover:border-border-hover hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
    >
      {isChangingLanguage ? (
        <LoaderCircle
          size={18}
          className="shrink-0 animate-spin text-primary"
          aria-hidden="true"
        />
      ) : (
        <Languages
          size={18}
          className="shrink-0 text-primary"
          aria-hidden="true"
        />
      )}

      <span className="text-xs font-semibold uppercase">
        {isChangingLanguage ? "..." : currentLangName}
      </span>
    </button>
  );
}