import type { UI_STRINGS } from "@/locales/languages";

// src/context/typeLanguageContext.ts
export type Language = "en" | "ar";

// Keep these generic so they don't depend on specific UI_STRINGS
type Join<K, P> = K extends string | number ?
    P extends string | number ?
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never;

export type Paths<T> = T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        `${K}` | Join<K, Paths<T[K]>>
        : never
    }[keyof T] : "";



type TranslationPaths = Paths<typeof UI_STRINGS.en>;



// Updated Interface including 'translate'
export interface LanguageContextType {
  lang: Language;
  t: (path: TranslationPaths) => string;
  translate: (value?: { ar?: string; en?: string }) => string;
  changeLanguage: (newLang: Language) => void;
}

