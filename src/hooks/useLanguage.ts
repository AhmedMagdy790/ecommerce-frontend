
import { useCallback, useMemo } from "react";

import { useLang } from "@/shared/context/LanguageContext";
import { UI_STRINGS } from "@/locales/languages";

export function useLanguage() {
  const {
    lang,
    dir,
    isRTL,
    changeLanguage,
    t,
    translate,
    isChangingLanguage,
  } = useLang();

  const availableLanguages = useMemo(
    () => Object.keys(UI_STRINGS) as Array<keyof typeof UI_STRINGS>,
    [],
  );

  const toggleLanguage = useCallback(async () => {
    if (isChangingLanguage || availableLanguages.length < 2) {
      return;
    }

    const currentIndex = availableLanguages.indexOf(lang);
    const nextIndex =
      currentIndex < 0
        ? 0
        : (currentIndex + 1) % availableLanguages.length;

    await changeLanguage(availableLanguages[nextIndex]);
  }, [
    lang,
    availableLanguages,
    changeLanguage,
    isChangingLanguage,
  ]);

  return {
    language: lang,
    lang,
    dir,
    isRTL,
    isArabic: lang === "ar",
    isEnglish: lang === "en",
    setLanguage: changeLanguage,
    toggleLanguage,
    t,
    translate,
    isChangingLanguage,
  };
}
