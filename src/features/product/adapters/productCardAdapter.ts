// src/features/product/adapters/productCardAdapter.ts

import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";
import type { Product } from "../model/types/product.types";


export function mapProductCard(
  product: Product,
) {
  // 1. Extract variants safely whether it's an array or an object containing a list
  const rawVariantsSource = product.variants;
  const variantsArray = Array.isArray(rawVariantsSource)
    ? rawVariantsSource
    : Array.isArray((rawVariantsSource )?.list)
      ? (rawVariantsSource).list
      : [];

  // 2. Find the lowest variant price if available
  const variantPrices = variantsArray
    .map((v: ProductVariant) => Number(v.price))
    .filter((p: number) => !isNaN(p));

  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : null;

  // 3. Resolve images collection safely
  const galleryImagesSource: string[] = Array.isArray(product.gallery)
    ? product.gallery
    : product.gallery?.images ?? [];

  const galleryImages = [
    product.thumbnail,
    product.featured_image,
    ...galleryImagesSource.map((img: string) =>
      typeof img === "string"
        ? img
        : (img as unknown as { url?: string })?.url
    ),
  ].filter(Boolean) as string[];

  const image =
    product.thumbnail ??
    product.featured_image ??
    galleryImages[0] ??
    "/images/placeholders/product.webp";

  // 4. Resolve correct price hierarchy
  const price =
    product.price ??
    product.starting_at ??
    minVariantPrice ??
    0;

  return {
    id: product.id,
    slug: product.slug,

    name: product.name,

    image: image,

    price: price,

    // oldPrice: product.old_price ?? undefined,

    link: `/products/${product.slug}`,
  };
}