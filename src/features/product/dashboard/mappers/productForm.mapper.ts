import { defaultTranslatedText } from "@/shared/constants/default";
import { defaultValues } from "../constants/productFormDefaults";

import type { ProductFormData } from "../../model/schema/productSchema";
import type { InitialProductData } from "../../model/types/productForm.types";

interface VariantAttributeSourceItem {
  key?: string;
  value?: string;
}

interface NormalizedVariantAttribute {
  key: string;
  value: string;
}

type VariantAttributesInput =
  | Record<string, string>
  | VariantAttributeSourceItem[]
  | null
  | undefined;

function normalizeVariantAttributes(
  attributes: VariantAttributesInput
): NormalizedVariantAttribute[] {
  if (!attributes) return [];

  if (Array.isArray(attributes)) {
    return attributes.map(({ key, value }): NormalizedVariantAttribute => ({
      key: key ?? "",
      value: value ?? "",
    }));
  }

  return Object.entries(attributes).map(([key, value]): NormalizedVariantAttribute => ({
    key,
    value: String(value ?? ""),
  }));
}

export function mapProductToForm(
  product?: InitialProductData | null
): ProductFormData {
  if (!product) return defaultValues;

  // Fallback helper for IDs that could be number, string, or inside an object
  const categoryId = product.category?.id ?? product.category_id;
  const brandId = product.brand?.id ?? product.brand_id;

  const result: ProductFormData = {
    ...defaultValues,
    id: product.id,
    name: product.name || defaultTranslatedText,
    description: product.description || defaultTranslatedText,
    
    // Ensure status matches the form status type.
    status: product.status || defaultValues.status || "active",
    
    is_featured: product.is_featured ?? false,

    brand_id: brandId !== undefined && brandId !== null ? String(brandId) : "",
    category_id: categoryId !== undefined && categoryId !== null ? String(categoryId) : "",

    variants:
      product.variants?.map((variant) => ({
        id: variant.id,
        sku: variant.sku ?? "",
        price: Number(variant.price) || 0,
        stock: Number(variant.stock) || 0,
        status: variant.status === "inactive" ? "inactive" : "active",
        attributes: normalizeVariantAttributes(variant.attributes),
      })) ?? defaultValues.variants,

    featured_image: product.featured_image ?? null,
    gallery: product.gallery ?? defaultValues.gallery,
    remove_images: defaultValues.remove_images,
  };

  return result;
}