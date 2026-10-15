export function normalizeVariantAttributes(
  attributes:
    | Record<string, string>
    | Array<{ key: string; value: string }>
    | null
    | undefined
) {
  if (!attributes) return [];

  if (Array.isArray(attributes)) {
    return attributes.map(({ key, value }) => ({
      key: key ?? "",
      value: value ?? "",
    }));
  }

  return Object.entries(attributes).map(([key, value]) => ({
    key,
    value: value ?? "",
  }));
}