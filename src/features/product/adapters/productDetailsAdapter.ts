import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";
import { mapVariant } from "@/features/product/adapters/variantAdapter";
import type {
  Product,
  ProductGalleryItem,
} from "@/features/product/model/types/product.types";
import type { Review } from "@/features/product/public/components/ProductReviews";

type MappedVariant = ReturnType<typeof mapVariant>;

export type ProductDetailsSource = Omit<
  Product<string>,
  "gallery" | "variants"
> & {
  gallery?: ProductGalleryItem[];
  variants?: ProductVariant<string>[];
  image?: string | null;
  oldPrice?: string | number | null;
  rating?: number | null;
  reviewsCount?: number | null;
  reviews?: Review[];
  relatedProducts?: RelatedProduct[];
  media?: unknown;
};

export type RelatedProduct = Pick<
  Product<string>,
  | "id"
  | "name"
  | "slug"
  | "price"
  | "starting_at"
  | "thumbnail"
  | "featured_image"
  | "status"
>;

export type ProductDetails = Omit<
  Product<string>,
  "gallery" | "variants" | "price"
> & {
  image: string;
  gallery: ProductGalleryItem[];
  price: string | number | null;
  oldPrice?: string | number;
  stock: number;
  rating: number;
  reviewsCount: number;
  variants: {
    list: MappedVariant[];
    sizes: string[];
    colors: string[];
  };
  reviews: Review[];
  relatedProducts: RelatedProduct[];
};

const PLACEHOLDER = "/images/placeholders/product.webp";

function getImageUrl(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.trim() || undefined;
  }

  if (typeof value !== "object" || value === null || !("url" in value)) {
    return undefined;
  }

  const url = value.url;

  return typeof url === "string" && url.trim()
    ? url
    : undefined;
}

function getImageUrls(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];

  return values
    .map(getImageUrl)
    .filter((url): url is string => Boolean(url));
}

function getAvailableStock(variant: MappedVariant): number {
  if (variant.status !== "active" || variant.is_available !== true) {
    return 0;
  }

  const stock = Number(variant.inventory?.available_stock ?? 0);

  return Number.isFinite(stock) ? Math.max(0, stock) : 0;
}

export function mapProductDetails(
  product: ProductDetailsSource,
): ProductDetails {
  const variants = (product.variants ?? []).map(mapVariant);

  const images = [
    ...new Set([
      ...getImageUrls(product.thumbnail),
      ...getImageUrls(product.featured_image),
      ...getImageUrls(product.media),
      ...getImageUrls(product.gallery),
    ]),
  ];

  const sizes = [
    ...new Set(
      variants
        .map((variant) => variant.attributes?.size)
        .filter((size): size is string => Boolean(size)),
    ),
  ];

  const colors = [
    ...new Set(
      variants
        .map((variant) => variant.attributes?.color)
        .filter((color): color is string => Boolean(color)),
    ),
  ];

  const availableVariants = variants.filter(
    (variant) => variant.status === "active" && variant.is_available === true,
  );

  const variantPrices = availableVariants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price >= 0);

  const startingPrice =
    variantPrices.length > 0 ? Math.min(...variantPrices) : null;

  const price =
    product.starting_at ??
    startingPrice ??
    product.price ??
    0;

  return {
    ...product,
    name: product.name ?? "",
    description: product.description ?? undefined,
    image: product.image || images[0] || PLACEHOLDER,
    gallery:
      images.length > 0
        ? images.map((url, index) => ({
            id: `gallery-${index}`,
            url,
            name: `Product image ${index + 1}`,
          }))
        : [
            {
              id: "placeholder",
              url: PLACEHOLDER,
              name: "Product image",
            },
          ],
    price,
    oldPrice: product.oldPrice ?? undefined,
    stock: variants.reduce(
      (total, variant) => total + getAvailableStock(variant),
      0,
    ),
    rating: product.rating ?? 0,
    reviewsCount: product.reviewsCount ?? 0,
    variants: {
      list: variants,
      sizes,
      colors,
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