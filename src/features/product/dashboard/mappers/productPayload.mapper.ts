// src/features/product/mappers/productPayload.mapper.ts

import type { ProductFormData } from "../../model/schema/productSchema";
import type { CreateProductDto } from "../../model/types/product.dto";
import { buildVariantDto } from "./variant.mapper";

export function buildProductPayload(
  data: ProductFormData
): CreateProductDto {
  const variants = (data.variants || []).map((variant) => {
    const dto = buildVariantDto(variant);

    return {
      ...dto,
      attributes: Object.entries(dto.attributes).map(([key, value]) => ({
        key,
        value,
      })),
    };
  });

  const newGalleryFiles = (data.gallery || []).filter(
    (item): item is File => item instanceof File
  );

  const featuredImage =
    data.featured_image instanceof File ? data.featured_image : undefined;

  return {
    name: data.name,
    description: data.description,

    brand_id: data.brand_id
      ? Number(data.brand_id)
      : undefined,

    category_id: Number(data.category_id),

    status: data.status ?? "active",
    is_featured: data.is_featured ?? false,

    variants,

    featured_image: featuredImage,
    gallery: newGalleryFiles,

    remove_images: data.remove_images || [],
  };
}