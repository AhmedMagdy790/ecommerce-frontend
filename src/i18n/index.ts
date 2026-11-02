import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { UI_STRINGS } from "@/locales/languages";

const DEFAULT_LANGUAGE = "en";

if (!UI_STRINGS[DEFAULT_LANGUAGE]) {
  throw new Error(`Default language "${DEFAULT_LANGUAGE}" is not configured.`);
}

const supportedLanguages = Object.keys(UI_STRINGS);

const savedLanguage =
  localStorage.getItem("language") ??
  localStorage.getItem("app_lang");

const initialLanguage =
  savedLanguage && supportedLanguages.includes(savedLanguage)
    ? savedLanguage
    : DEFAULT_LANGUAGE;

const namespaces = Object.keys(
  UI_STRINGS[DEFAULT_LANGUAGE] || {},
).filter((namespace) => namespace !== "_config");

const getLanguageDirection = (
  lng: string,
): "ltr" | "rtl" => {
  return UI_STRINGS[lng]?._config?.dir ?? "ltr";
};

i18n.use(initReactI18next).init({
  resources: UI_STRINGS,
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: supportedLanguages,
  defaultNS: "common",
  ns: namespaces,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  const direction = getLanguageDirection(lng);

  localStorage.setItem("language", lng);
  localStorage.setItem("direction", direction);

  document.documentElement.lang = lng;
  document.documentElement.dir = direction;
});

const initialDirection = getLanguageDirection(initialLanguage);

document.documentElement.lang = initialLanguage;
document.documentElement.dir = initialDirection;

export default i18n;