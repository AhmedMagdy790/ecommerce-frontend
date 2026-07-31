import { useLang } from "@/shared/context/LanguageContext";

export function useLanguage() {
  const { lang, changeLanguage, t, translate } = useLang();

  // الحفاظ على التوافق مع الكود القديم
  const toggleLanguage = () => {
    changeLanguage(lang === "ar" ? "en" : "ar");
  };

  return {
    language: lang,
    isArabic: lang === "ar",
    isEnglish: lang === "en",
    setLanguage: changeLanguage,
    toggleLanguage,
    t,          // للترجمة العامة (UI)
    translate,  // لترجمة بيانات الـ API
  };
}