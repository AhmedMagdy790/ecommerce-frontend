
import fs from "node:fs";
import path from "node:path";

const LOCALES_DIR = path.resolve("src/locales");
const BASE_LANGUAGE = "en";
const REQUIRED_LANGUAGES = ["en", "ar"];

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type TranslationMap = Record<string, string>;

let hasErrors = false;

function error(message: string): void {
  console.error(`❌ ${message}`);
  hasErrors = true;
}

function warning(message: string): void {
  console.warn(`⚠️ ${message}`);
}

function readJson(filePath: string): JsonValue | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as JsonValue;
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : String(cause);

    error(`Invalid JSON: ${path.relative(process.cwd(), filePath)}`);
    console.error(`   ${message}`);

    return null;
  }
}

function isJsonObject(
  value: JsonValue,
): value is { [key: string]: JsonValue } {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getJsonFiles(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isFile() && entry.name.endsWith(".json"),
      )
      .map((entry) => entry.name)
      .sort();
  } catch {
    error(`Cannot read directory: ${dir}`);
    return [];
  }
}

function flatten(
  value: JsonValue,
  prefix = "",
): TranslationMap {
  const result: TranslationMap = {};

  if (typeof value === "string") {
    if (prefix) {
      result[prefix] = value;
    }

    return result;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const key = prefix ? `${prefix}.${index}` : String(index);

      Object.assign(result, flatten(item, key));
    });

    return result;
  }

  if (isJsonObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      Object.assign(result, flatten(child, fullKey));
    }
  }

  return result;
}

function validateJsonFile(
  language: string,
  file: string,
  filePath: string,
): TranslationMap | null {
  const json = readJson(filePath);

  if (json === null) {
    return null;
  }

  if (!isJsonObject(json)) {
    error(`${language}/${file}: Root must be a JSON object.`);
    return null;
  }

  const translations = flatten(json);

  if (Object.keys(translations).length === 0) {
    error(`${language}/${file}: No translation strings found.`);
    return null;
  }

  for (const [key, value] of Object.entries(translations)) {
    if (!value.trim()) {
      error(`Empty translation: ${language}/${file} -> ${key}`);
    }
  }

  return translations;
}

function compareTranslations(
  language: string,
  file: string,
  base: TranslationMap,
  target: TranslationMap,
): void {
  for (const key of Object.keys(base)) {
    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      error(`Missing key: ${language}/${file} -> ${key}`);
    }
  }

  for (const key of Object.keys(target)) {
    if (!Object.prototype.hasOwnProperty.call(base, key)) {
      warning(`Extra key: ${language}/${file} -> ${key}`);
    }
  }
}

// 1. Validate locales directory.
if (!fs.existsSync(LOCALES_DIR)) {
  throw new Error(`Locales directory not found: ${LOCALES_DIR}`);
}

// 2. Discover available languages.
const availableLanguages = fs
  .readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// 3. Check required languages.
for (const language of REQUIRED_LANGUAGES) {
  if (!availableLanguages.includes(language)) {
    error(`Required language directory is missing: ${language}`);
  }
}

const baseDir = path.join(LOCALES_DIR, BASE_LANGUAGE);

if (!availableLanguages.includes(BASE_LANGUAGE)) {
  console.error("\nTranslation check failed.");
  process.exit(1);
}

// 4. Read and validate base language.
console.log(`\nChecking base language: ${BASE_LANGUAGE.toUpperCase()}`);

const baseFiles = getJsonFiles(baseDir);
const baseTranslations = new Map<string, TranslationMap>();

for (const file of baseFiles) {
  const translations = validateJsonFile(
    BASE_LANGUAGE,
    file,
    path.join(baseDir, file),
  );

  if (translations) {
    baseTranslations.set(file, translations);
  }
}

if (baseFiles.length === 0) {
  error(`No JSON files found in ${BASE_LANGUAGE}/`);
}

// 5. Compare every other available language.
const targetLanguages = availableLanguages.filter(
  (language) => language !== BASE_LANGUAGE,
);

for (const language of targetLanguages) {
  const languageDir = path.join(LOCALES_DIR, language);
  const languageFiles = getJsonFiles(languageDir);

  console.log(`\nChecking language: ${language.toUpperCase()}`);

  // Check files and keys from the base language.
  for (const file of baseFiles) {
    const targetPath = path.join(languageDir, file);

    if (!fs.existsSync(targetPath)) {
      error(`Missing file: ${language}/${file}`);
      continue;
    }

    const base = baseTranslations.get(file);

    const target = validateJsonFile(
      language,
      file,
      targetPath,
    );

    if (!base || !target) {
      continue;
    }

    compareTranslations(language, file, base, target);
  }

  // Warn about files that don't exist in the base language.
  for (const file of languageFiles) {
    if (!baseFiles.includes(file)) {
      warning(`Extra file: ${language}/${file}`);
    }
  }
}

// 6. Final result.
console.log("\n--------------------------------");

if (hasErrors) {
  console.error("Translation check failed.");
  process.exit(1);
}

console.log("All translation checks passed.");