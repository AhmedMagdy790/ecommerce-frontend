// src/features/product/adapters/productDetailsAdapter.ts

import { mapVariant } from "@/features/product/adapters/variantAdapter";
import type { ApiProduct } from "@/features/product/types/api";
import type { Product } from "@/features/product/types/product";
import { localize } from "@/shared/utils/localize";

export function mapProductDetails(
  product: ApiProduct,
  lang: "ar" | "en"
): Product {
  // Ensure variants is treated as an array whether it comes as an array or an object containing a list/array
  const rawVariantsSource = product.variants;
  const variantsArray = Array.isArray(rawVariantsSource)
    ? rawVariantsSource
    : Array.isArray((rawVariantsSource as any)?.list)
      ? (rawVariantsSource as any).list
      : [];

  const variants = variantsArray.map(mapVariant);

  const galleryImages = [
    product.thumbnail,
    product.featured_image,
    ...(product.gallery ?? []).map((img: any) => 
      typeof img === "string" ? img : img?.url
    ),
  ].filter(Boolean) as string[];

  const stockValue = variants.reduce(
    (total, variant) => total + (Number(variant.stock) || 0),
    0
  );

  return {
    id: product.id,
    slug: product.slug,

    name: localize(product.name, lang),
    description: localize(product.description, lang),

    image:
      product.thumbnail ??
      galleryImages[0] ??
      "/images/placeholders/product.webp",

    gallery: {
      images: galleryImages.length > 0 
        ? galleryImages 
        : ["/images/placeholders/product.webp"],
    },

    price:
      product.price ??
      product.starting_at ??
      variants[0]?.price ??
      0,

    oldPrice: product.old_price ?? undefined,

    stock: stockValue,

    rating: product.rating ?? 0,
    reviewsCount: product.reviews_count ?? product.reviewsCount ?? 0,

    variants: {
      list: variants,

      sizes: [
        ...new Set(
          variants
            .map((v) => v.attributes?.size)
            .filter((size): size is string => Boolean(size))
        ),
      ],

      colors: [
        ...new Set(
          variants
            .map((v) => v.attributes?.color)
            .filter((color): color is string => Boolean(color))
        ),
      ],
    },

    brand: product.brand
      ? {
          id: product.brand.id,
          name: localize(product.brand.name, lang),
          logo: product.brand.logo ?? undefined,
        }
      : undefined,

    category: product.category
      ? {
          id: product.category.id,
          name: localize(product.category.name, lang),
          slug: product.category.slug,
        }
      : undefined,

    reviews: product.reviews ?? [],
    relatedProducts: product.relatedProducts ?? product.related_products ?? [],
  };
}