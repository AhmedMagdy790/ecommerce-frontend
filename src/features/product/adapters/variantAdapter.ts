import type { ApiVariant } from "@/shared/types/variant";
import type { ProductVariant } from "../types/product";

export function mapVariant(
  variant: ApiVariant
): ProductVariant {

  return {
    id: variant.id,
    sku: variant.sku,
    price: variant.price,
    stock: variant.stock,

    isAvailable: variant.stock > 0,

    attributes: {
      size: variant.attributes?.size,
      color: variant.attributes?.color,
    },
  };
}