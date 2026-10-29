import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";

export type MappedVariant = Omit<ProductVariant, "price"> & {
  price: number;
};

export function mapVariant(variant: ProductVariant): MappedVariant {
  const parsedPrice = Number(variant.price);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    throw new Error(
      `Invalid price for product variant ${variant.id}: ${variant.price}`,
    );
  }

  return {
    ...variant,
    price: parsedPrice,
    attributes: variant.attributes
      ? { ...variant.attributes }
      : null,
  };
}