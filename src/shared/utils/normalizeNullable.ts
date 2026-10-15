export function normalizeNullable<T>(
  value: T | null | undefined | "null"
): T | null {
  if (value === null || value === undefined || value === "null") {
    return null;
  }

  return value;
}