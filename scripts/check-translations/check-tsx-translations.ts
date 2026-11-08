
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const SRC_DIR = path.resolve("src");
const LOCALES_DIR = path.resolve("src/locales");

const BASE_LANGUAGE = "en";
const TARGET_LANGUAGES = ["en", "ar"];
const DEFAULT_NAMESPACE = "common";

type TranslationJson = {
  [key: string]: unknown;
};


let hasErrors = false;

const namespaceCache = new Map<
  string,
  TranslationJson | null
>();

function error(message: string): void {
  console.error(`❌ ${message}`);
  hasErrors = true;
}

function warning(message: string): void {
  console.warn(`⚠️ ${message}`);
}

function getTsxFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    error(`Source directory not found: ${dir}`);
    return files;
  }

  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      getTsxFiles(fullPath).forEach((file) =>
        files.push(file),
      );
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".tsx")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function readNamespace(
  language: string,
  namespace: string,
): TranslationJson | null {
  const cacheKey = `${language}/${namespace}`;

  if (namespaceCache.has(cacheKey)) {
    return namespaceCache.get(cacheKey) ?? null;
  }

  const filePath = path.join(
    LOCALES_DIR,
    language,
    `${namespace}.json`,
  );

  if (!fs.existsSync(filePath)) {
    namespaceCache.set(cacheKey, null);
    return null;
  }

  try {
    const content: unknown = JSON.parse(
      fs.readFileSync(filePath, "utf-8"),
    );

    if (
      typeof content !== "object" ||
      content === null ||
      Array.isArray(content)
    ) {
      error(
        `Invalid namespace root: ${language}/${namespace}.json`,
      );

      namespaceCache.set(cacheKey, null);
      return null;
    }

    const translations = content as TranslationJson;

    namespaceCache.set(cacheKey, translations);

    return translations;
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : String(cause);

    error(
      `Cannot read ${language}/${namespace}.json: ${message}`,
    );

    namespaceCache.set(cacheKey, null);

    return null;
  }
}

function hasTranslationKey(
  translations: TranslationJson,
  key: string,
): boolean {
  const parts = key.split(".");
  let current: unknown = translations;

  for (const part of parts) {
    if (
      typeof current !== "object" ||
      current === null ||
      !Object.prototype.hasOwnProperty.call(current, part)
    ) {
      return false;
    }

    current = (current as TranslationJson)[part];
  }

  return typeof current === "string";
}

function getStringArgument(
  node: ts.Expression | undefined,
): string | null {
  if (
    node &&
    (ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node))
  ) {
    return node.text;
  }

  return null;
}

function getTranslationFunctions(
  sourceFile: ts.SourceFile,
): Map<string, string> {
  const functions = new Map<string, string>();

  function visit(node: ts.Node): void {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isObjectBindingPattern(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      ts.isIdentifier(node.initializer.expression) &&
      node.initializer.expression.text === "useTranslation"
    ) {
      const namespace =
        getStringArgument(node.initializer.arguments[0]) ??
        DEFAULT_NAMESPACE;

      for (const element of node.name.elements) {
        if (!ts.isBindingElement(element)) {
          continue;
        }

        const originalName = element.propertyName
          ? element.propertyName.getText(sourceFile)
          : element.name.getText(sourceFile);

        if (
          originalName === "t" &&
          ts.isIdentifier(element.name)
        ) {
          functions.set(element.name.text, namespace);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return functions;
}

function getPosition(
  sourceFile: ts.SourceFile,
  node: ts.Node,
): { line: number; column: number } {
  const position = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile),
  );

  return {
    line: position.line + 1,
    column: position.character + 1,
  };
}

function checkFile(filePath: string): void {
  const source = fs.readFileSync(filePath, "utf-8");

  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const translationFunctions =
    getTranslationFunctions(sourceFile);

  const checkedNamespaces = new Set<string>();

  for (const namespace of translationFunctions.values()) {
    if (checkedNamespaces.has(namespace)) {
      continue;
    }

    checkedNamespaces.add(namespace);

    for (const language of TARGET_LANGUAGES) {
      if (!readNamespace(language, namespace)) {
        error(
          `Missing namespace: ${language}/${namespace}.json ` +
          `used in ${path.relative(process.cwd(), filePath)}`,
        );
      }
    }
  }

  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression)
    ) {
      const namespace = translationFunctions.get(
        node.expression.text,
      );

      if (namespace) {
        const key = getStringArgument(node.arguments[0]);

        if (key === null) {
          if (node.arguments.length > 0) {
            warning(
              `Dynamic translation key cannot be checked: ` +
              `${path.relative(process.cwd(), filePath)}`,
            );
          }
        } else {
          const translations = readNamespace(
            BASE_LANGUAGE,
            namespace,
          );

          if (
            translations &&
            !hasTranslationKey(translations, key)
          ) {
            const position = getPosition(sourceFile, node);

            error(
              `${path.relative(process.cwd(), filePath)}` +
              `:${position.line}:${position.column} ` +
              `Missing key: ${namespace} -> ${key}`,
            );
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

// Main
console.log("\nChecking TSX translation usage...");

const files = getTsxFiles(SRC_DIR);

let checkedFiles = 0;

for (const file of files) {
  checkFile(file);
  checkedFiles++;
}

console.log("\n--------------------------------");
console.log(`Checked TSX files: ${checkedFiles}`);

if (hasErrors) {
  console.error("TSX translation check failed.");
  process.exit(1);
}

console.log("All TSX translation checks passed.");