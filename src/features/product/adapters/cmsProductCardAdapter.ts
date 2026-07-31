// cmsProductCardAdapter.ts

import type { ApiProduct } from "@/features/product/types/api";
import { localize } from "@/shared/utils/localize";

export function mapCmsProducts(
  products: ApiProduct[],
  lang: "ar" | "en"
) {
  return products.map(product => ({
    id: product.id,
    slug: product.slug,

    name: localize(product.name, lang),

    image:
      product.thumbnail ??
      product.featured_image ??
      "/images/placeholders/product.webp",

    price:
      product.price ??
      Number(product.starting_at) ??
      Number(product.variants[0]?.price ?? 0),

    link: `/products/${product.slug}`,
  }));
}