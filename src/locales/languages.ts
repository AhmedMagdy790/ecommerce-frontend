// src/locales/languages.ts


const languageModules = import.meta.glob("./*/*.json", { eager: true });

const buildUIStrings = () => {
  const result: Record<string, Record<string, any>> = {};

  for (const path in languageModules) {

    const match = path.match(/\.\/([^/]+)\/([^/]+)\.json$/);
    if (match) {
      const [, lng, fileName] = match;
      if (!result[lng]) {
        result[lng] = {};
      }
      const mod = languageModules[path] as any;
      const content = mod.default || mod;


      if (fileName === "config") {
        result[lng]["_config"] = content;
      } else {

        result[lng][fileName] = content;
      }
    }
  }

  return result;
};

export const UI_STRINGS = buildUIStrings() as Record<string, any>;

export type TranslationSchema = typeof UI_STRINGS[keyof typeof UI_STRINGS];