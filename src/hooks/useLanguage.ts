import { useLang } from "@/shared/context/LanguageContext";
import { UI_STRINGS } from "@/locales/languages";

export function useLanguage() {
  const { lang, dir, isRTL, changeLanguage, t, translate } = useLang();

  const availableLanguages = Object.keys(UI_STRINGS) as Array<keyof typeof UI_STRINGS>;

  const toggleLanguage = () => {
    const currentIndex = availableLanguages.indexOf(lang);

    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    changeLanguage(nextIndex >= 0 ? availableLanguages[nextIndex] : "en");
  };

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
  };
}