
import type {
  Product,
  ProductGalleryItem,
} from "@/features/product/model/types/product.types";
import { getValidImage } from "@/shared/utils/helper";

const PRODUCT_PLACEHOLDER = "/images/placeholders/product.webp";

type ProductCardSource = Pick<
  Product<string>,
  | "id"
  | "slug"
  | "name"
  | "price"
  | "starting_at"
  | "featured_image"
  | "thumbnail"
  | "gallery"
>;

export interface ProductCardModel {
  id: number | string;
  slug: string;
  name: string;
  image: string;
  price: string | null;
  link: string;
}



function getGalleryImage(
  gallery?: ProductGalleryItem[],
): string | undefined {
  return gallery
    ?.map((item) => getValidImage(item.url))
    .find((url): url is string => Boolean(url));
}

export function mapProductCard(
  product: ProductCardSource,
): ProductCardModel {
  const image =
    getValidImage(product.thumbnail) ??
    getValidImage(product.featured_image) ??
    getGalleryImage(product.gallery) ??
    PRODUCT_PLACEHOLDER;

  const rawPrice = product.starting_at ?? product.price;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    image,
    price: rawPrice == null ? null : String(rawPrice),
    link: `/products/${product.slug}`,
  };
}
