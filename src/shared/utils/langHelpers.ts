// src/shared/utils/langHelpers.ts
import { UI_STRINGS } from "@/locales/languages";
import type { TranslatedText } from "@/shared/types/types";


export function getEmptyTranslatedObject(): TranslatedText {
  const langKeys = Object.keys(UI_STRINGS || {});

  return langKeys.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {} as Record<string, string>) as TranslatedText;
}

export const langKeys = Object.keys(UI_STRINGS || {});