import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from "react";
import { UI_STRINGS, type TranslationSchema } from "@/locales/languages";
import { langKeys } from "@/shared/utils/langHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { type Language, type Paths } from "./typeLanguageContext";

type TranslationPaths = Paths<TranslationSchema>;

export interface LanguageContextType {
  lang: Language;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  isChangingLanguage: boolean;
  t: (path: TranslationPaths) => string;
  translate: (value?: Record<string, string | undefined>) => string;
  changeLanguage: (newLang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: any, path: string): string => {
  return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
};

const getInitialLanguage = (): Language => {
  const savedLang = localStorage.getItem("app_lang") as Language;
  if (savedLang && langKeys.includes(savedLang)) {
    return savedLang;
  }
  if (langKeys.includes("en" as Language)) return "en" as Language;
  return (langKeys[0] as Language) || "ar";
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  
  const queryClient = useQueryClient();

  const langObj = UI_STRINGS[lang];
  const rawDir = langObj?._config?.dir;
  const dir: "ltr" | "rtl" = (typeof rawDir === "string" ? rawDir : "ltr") as "ltr" | "rtl";
  const isRTL: boolean = dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.classList.toggle('is-rtl', dir === 'rtl');
  }, [lang, dir]);

  // دالة التغيير المحدثة
  const changeLanguage = useCallback(
    async (newLang: Language): Promise<void> => {
      if (!langKeys.includes(newLang) || newLang === lang) {
        return;
      }

      setIsChangingLanguage(true);

      try {
        // Save language first so Axios can read it immediately.
        localStorage.setItem("app_lang", newLang);

        // Update the document direction and language.
        const nextDir =
          UI_STRINGS[newLang]?._config?.dir === "rtl" ? "rtl" : "ltr";

        document.documentElement.dir = nextDir;
        document.documentElement.lang = newLang;
        document.body.classList.toggle("is-rtl", nextDir === "rtl");

        // Update React state immediately.
        setLang(newLang);

        // Wait for active queries to finish their refetch.
        await queryClient.invalidateQueries();
      } finally {
        setIsChangingLanguage(false);
      }
    },
    [lang, queryClient],
  );

  const t = useCallback((path: TranslationPaths): string => {
    const value = getNestedValue(UI_STRINGS[lang], path as string);
    if (!value && process.env.NODE_ENV === 'development') {
      console.warn(`Translation missing for key: ${path} in ${lang}`);
    }
    return value || getNestedValue(UI_STRINGS['en'], path as string) || path;
  }, [lang]);

  const translate = useCallback((value?: Record<string, string | undefined>): string => {
    if (!value) return "";
    return value[lang] || value["en"] || Object.values(value)[0] || "";
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      dir,
      t,
      translate,
      changeLanguage,
      isRTL,
      isChangingLanguage,
    }),
    [lang, dir, t, translate, changeLanguage, isRTL, isChangingLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
};