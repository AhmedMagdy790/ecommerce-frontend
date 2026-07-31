// shared/utils/localize.ts

import type { Language } from "@/shared/context/typeLanguageContext";

export function getCurrentLanguage(): Language {
  return (localStorage.getItem("app_lang") as Language) || "en";
}

export function localize(
  value?: string | { ar?: string; en?: string },
  lang: Language = getCurrentLanguage()
) {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value[lang] ?? value.en ?? value.ar ?? "";
}