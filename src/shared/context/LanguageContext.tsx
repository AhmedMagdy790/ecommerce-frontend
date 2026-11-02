
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

import {
  UI_STRINGS,
  type TranslationSchema,
} from "@/locales/languages";
import { langKeys } from "@/shared/utils/langHelpers";
import {
  type Language,
  type Paths,
} from "./typeLanguageContext";
import i18n from "@/i18n";

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

const LanguageContext =
  createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: any, path: string): string => {
  return path
    .split(".")
    .reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
};

const getInitialLanguage = (): Language => {
  const currentLanguage =
    i18n.resolvedLanguage ?? i18n.language;

  if (langKeys.includes(currentLanguage as Language)) {
    return currentLanguage as Language;
  }

  return "en" as Language;
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // يمنع بدء أكثر من عملية تغيير لغة في نفس الوقت.
  const isChangingRef = useRef(false);

  const langObj = UI_STRINGS[lang];
  const rawDir = langObj?._config?.dir;

  const dir: "ltr" | "rtl" =
    rawDir === "rtl" ? "rtl" : "ltr";

  const isRTL = dir === "rtl";

  useEffect(() => {
      const handleLanguageChanged = (lng: string) => {
        if (langKeys.includes(lng as Language)) {
          setLang(lng as Language);
        }
      };

      i18n.on("languageChanged", handleLanguageChanged);

      return () => {
        i18n.off("languageChanged", handleLanguageChanged);
      };
    }, []);

    useEffect(() => {
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
      document.body.classList.toggle("is-rtl", isRTL);
    }, [lang, dir, isRTL]);

    const changeLanguage = useCallback(
    async (newLang: Language): Promise<void> => {
      if (
        !langKeys.includes(newLang) ||
        newLang === lang ||
        isChangingRef.current
      ) {
        return;
      }

      isChangingRef.current = true;
      setIsChangingLanguage(true);

      try {
        await i18n.changeLanguage(newLang);
      } catch (error) {
        console.error("Failed to change language:", error);
        throw error;
      } finally {
        setIsChangingLanguage(false);
        isChangingRef.current = false;
      }
    },
    [lang],
  );

  const t = useCallback(
    (path: TranslationPaths): string => {
      const value = getNestedValue(UI_STRINGS[lang], path as string);

      if (!value && process.env.NODE_ENV === "development") {
        console.warn(
          `Translation missing for key: ${path} in ${lang}`,
        );
      }

      return (
        value ||
        getNestedValue(UI_STRINGS.en, path as string) ||
        path
      );
    },
    [lang],
  );

  const translate = useCallback(
    (value?: Record<string, string | undefined>): string => {
      if (!value) return "";

      return (
        value[lang] ||
        value.en ||
        Object.values(value)[0] ||
        ""
      );
    },
    [lang],
  );

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
    [
      lang,
      dir,
      t,
      translate,
      changeLanguage,
      isRTL,
      isChangingLanguage,
    ],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLang must be used within LanguageProvider",
    );
  }

  return context;
};
