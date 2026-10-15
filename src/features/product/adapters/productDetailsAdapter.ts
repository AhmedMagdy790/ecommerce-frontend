// src/features/product/adapters/productDetailsAdapter.ts

import { mapVariant } from "@/features/product/adapters/variantAdapter";
import type { Product } from "../model/types/product.types";

export function mapProductDetails(
  product: Product<string>
): Product<string> {
  const variantsArray = Array.isArray(product.variants) ? product.variants : [];
  const variants = variantsArray.map(mapVariant);

  const galleryImages = [
    product.media,
    product.featured_image,
    ...(Array.isArray(product.gallery) ? product.gallery : []).map((img: unknown) =>
      typeof img === "string"
        ? img
        : typeof img === "object" && img !== null && "url" in img
          ? String(img.url)
          : undefined
    ),
  ].filter(Boolean) as string[];

  const stockValue = variants.reduce(
    (total, variant) => total + (Number(variant.stock) || 0),
    0
  );

  return {
    ...product, // الاحتفاظ ببقية الحقول الأصلية إن وجدت

    // الاعتماد المباشر على الـ string لأن الباك إند يرسله جاهزاً
    name: product.name ?? "",
    description: product.description ?? undefined,

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

    oldPrice: product.oldPrice ?? undefined, 
    stock: stockValue,
    rating: product.rating ?? 0,
    reviewsCount: product.reviewsCount ?? 0,

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
          ...product.brand,
          name: product.brand.name ?? "",
          logo: product.brand.logo ?? null,
        }
      : undefined,

    category: product.category
      ? {
          ...product.category,
          name: product.category.name ?? "",
        }
      : undefined,

    reviews: product.reviews ?? [],
    relatedProducts: product.relatedProducts ?? [],
  };
}