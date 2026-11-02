// src/locales/languages.ts

interface LanguageConfig {
  dir: "ltr" | "rtl";
  name: string;
  nativeName: string;
}

type JsonObject = Record<string, unknown>;

interface LanguageResources extends Record<string, JsonObject | LanguageConfig> {
  _config: LanguageConfig;
}

const languageModules = import.meta.glob<JsonObject>(
  "./*/*.json",
  {
    eager: true,
    import: "default",
  },
);

const buildUIStrings = (): Record<string, LanguageResources> => {
  const result: Record<string, Record<string, JsonObject>> = {};

  for (const [path, content] of Object.entries(languageModules)) {
    const match = path.match(/^\.\/([^/]+)\/([^/]+)\.json$/);

    if (!match) continue;

    const [, lng, fileName] = match;

    if (!result[lng]) {
      result[lng] = {};
    }

    const key = fileName === "config" ? "_config" : fileName;

    result[lng][key] = content;
  }

  return result as Record<string, LanguageResources>;
};

export const UI_STRINGS = buildUIStrings();

export type TranslationSchema =
  (typeof UI_STRINGS)[keyof typeof UI_STRINGS];