// src/features/product/adapters/productCardAdapter.ts

import { localize } from "@/shared/utils/localize";
import type { ApiProduct } from "../types/api";
import type { LocalizedText } from "@/shared/utils/localizedText";

export function mapProductCard(
  product: ApiProduct,
  lang: LocalizedText
) {
  // 1. Extract variants safely whether it's an array or an object containing a list
  const rawVariantsSource = product.variants;
  const variantsArray = Array.isArray(rawVariantsSource)
    ? rawVariantsSource
    : Array.isArray((rawVariantsSource as any)?.list)
      ? (rawVariantsSource as any).list
      : [];

  // 2. Find the lowest variant price if available
  const variantPrices = variantsArray
    .map((v: any) => parseFloat(v.price))
    .filter((p: number) => !isNaN(p));

  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : null;

  // 3. Resolve images collection safely
  const galleryImages = [
    product.thumbnail,
    product.featured_image,
    ...(product.gallery ?? []).map((img: any) =>
      typeof img === "string" ? img : img?.url
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

    name: localize(product.name, lang),

    image: image,

    price: price,

    oldPrice: product.old_price ?? undefined,

    link: `/products/${product.slug}`,
  };
}