import { toNumber } from "@/shared/utils/helper";
import type { variantFormData } from "../../model/schema/variantSchema";
import type { ProductVariant } from "../../model/types/productVariant.types";
import { defaultProductVariantValues } from "../constants/productVariantFormDefaults";

export interface ProductVariantAttributes {
  size?: string;
  color?: string;
  [key: string]: unknown;
}

function normalizeVariantAttributes(
  attributes:
    | ProductVariantAttributes
    | Array<{ key: string; value: string }>
    | null
    | undefined,
): Array<{ key: string; value: string }> {
  if (!attributes) return [];

  if (Array.isArray(attributes)) {
    return attributes
      .filter(({ key }) => Boolean(key))
      .map(({ key, value }) => ({
        key,
        value: value ?? "",
      }));
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
    price: toNumber(variant.price),
    stock: toNumber(variant.inventory?.stock_quantity),
    weight: toNumber(variant.weight),
    length: toNumber(variant.length),
    width: toNumber(variant.width),
    height: toNumber(variant.height),
    status: variant.status === "inactive" ? "inactive" : "active",
    attributes: normalizeVariantAttributes(variant.attributes),
  };

  return result;
}