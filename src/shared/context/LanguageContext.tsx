import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from "react";
import { UI_STRINGS, type TranslationSchema } from "@/locales/languages";
import { type Language, type Paths } from "./typeLanguageContext";

type TranslationPaths = Paths<TranslationSchema>;

export interface LanguageContextType {
  lang: Language;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  t: (path: TranslationPaths) => string;
  translate: (value?: { ar?: string; en?: string }) => string;
  changeLanguage: (newLang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: any, path: string): string => {
  return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>(
    (localStorage.getItem("app_lang") as Language) || "en"
  );

  const langObj = UI_STRINGS[lang] as any;
  const rawDir = langObj?.dir;
  const dir: "ltr" | "rtl" = (typeof rawDir === "string" ? rawDir : rawDir?.dir || rawDir?.default?.dir || "ltr") as "ltr" | "rtl";
  const isRTL: boolean = dir == 'rtl';

  console.log("dir resolved: ", dir);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.classList.toggle('is-rtl', dir === 'rtl');
    localStorage.setItem("app_lang", lang);
  }, [lang, dir]);

  const t = useCallback((path: TranslationPaths): string => {
    const value = getNestedValue(UI_STRINGS[lang], path as string);
    if (!value && process.env.NODE_ENV === 'development') {
      console.warn(`Translation missing for key: ${path} in ${lang}`);
    }
    return value || getNestedValue(UI_STRINGS['en'], path as string) || path;
  }, [lang]);

  const translate = useCallback((value?: { ar?: string; en?: string }): string => {
    if (!value) return "";
    return value[lang] || value.en || "";
  }, [lang]);

  const changeLanguage = (newLang: Language) => setLang(newLang);

  const value = useMemo(() => ({
    lang, dir, t, translate, changeLanguage, isRTL
  }), [lang, dir, t, translate]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
};