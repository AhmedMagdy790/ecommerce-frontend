import type { variantFormData } from "../../model/schema/variantSchema";
import type { ProductVariant } from "../../model/types/productVariant.types";
import { defaultProductVariantValues } from "../constants/productVariantFormDefaults";

function normalizeVariantAttributes(
  attributes:
    | Record<string, string>
    | Array<{ key: string; value: string }>
    | null
    | undefined
): Array<{ key: string; value: string }> {
  if (!attributes) return [];

  if (Array.isArray(attributes)) {
    return attributes
      .filter(({ key }) => Boolean(key))
      .map(({ key, value }) => ({ key, value: value ?? "" }));
  }

  return Object.entries(attributes).map(([key, value]) => ({
    key,
    value: String(value ?? ""),
  }));
}

export function mapProductVariantToForm(
  variant?: ProductVariant | null
): variantFormData {
  if (!variant) return defaultProductVariantValues;

  const result: variantFormData = {
    ...defaultProductVariantValues,
    id: variant.id ?? null,
    sku: variant.sku ?? "",
    price: Number(variant.price) || 0,
    stock: Number(variant.stock) || 0,
    weight: Number(variant.weight) || 0,
    length: Number(variant.length) || 0,
    width: Number(variant.width) || 0,
    height: Number(variant.height) || 0,
    status: variant.status === "inactive" ? "inactive" : "active",
    attributes: normalizeVariantAttributes(variant.attributes),
  };

  return result;
}