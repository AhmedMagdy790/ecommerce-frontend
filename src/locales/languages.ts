// src/locales/languages.ts
import { en } from "./en";
import { ar } from "./ar";

export const UI_STRINGS = {
  en,
  ar,
} as const; 


export type TranslationSchema = typeof UI_STRINGS.en;