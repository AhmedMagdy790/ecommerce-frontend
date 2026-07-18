import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export type Language = "en" | "ar";

export function useLanguage() {
  const { i18n } = useTranslation();

  const language = (i18n.resolvedLanguage || i18n.language) as Language;

  const setLanguage = useCallback(
    async (language: Language) => {
      await i18n.changeLanguage(language);
    },
    [i18n]
  );

  const toggleLanguage = useCallback(async () => {
    await i18n.changeLanguage(language === "ar" ? "en" : "ar");
  }, [i18n, language]);

  return {
    language,
    isArabic: language === "ar",
    isEnglish: language === "en",
    setLanguage,
    toggleLanguage,
  };
}