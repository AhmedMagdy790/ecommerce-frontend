// src/features/product/mappers/variant.mapper.ts

import type { ProductFormData } from "../../model/schema/productSchema";


type VariantFormData = NonNullable<ProductFormData["variants"]>[number];

export function buildVariantDto(variant: VariantFormData) {
  return {
    id: variant.id,
    sku: variant.sku ?? "",
    price: Number(variant.price) || 0,
    stock: Number(variant.stock) || 0,
    status: variant.status,

    attributes: (variant.attributes || []).reduce(
      (acc, item) => {
        const key = item.key?.trim();
        const value = item.value?.trim();

        if (!key || !value) return acc;

        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    ),
  };
}