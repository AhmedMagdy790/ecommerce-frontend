// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { UI_STRINGS } from "@/locales/languages";


const savedLanguage = localStorage.getItem("language") || "en";

const namespaces = Object.keys(UI_STRINGS.en || {});

i18n
  .use(initReactI18next)
  .init({
    resources: UI_STRINGS,
    lng: savedLanguage,
    fallbackLng: "en",
    defaultNS: "common",
    ns: namespaces,
    interpolation: {
      escapeValue: false,
    },
  });

const getLanguageDirection = (lng: string) => {
  const langData = (UI_STRINGS as any)[lng];

  return langData?.dir?.dir || "ltr";
};


i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  
  const direction = getLanguageDirection(lng);
  localStorage.setItem("direction", direction);

  document.documentElement.lang = lng;
  document.documentElement.dir = direction;
});


const initialDir = getLanguageDirection(savedLanguage);
document.documentElement.lang = savedLanguage;
document.documentElement.dir = initialDir;

export default i18n;