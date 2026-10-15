import type { SectionItem } from "@/features/cms/section/model/types/sectionItem.types";
import type { Product } from "../model/types/product.types";

export interface CmsProductCardViewModel {
  id: number | string;
  slug?: string;
  name: string;
  description?: string; 
  image: string;
  price: number;
  link: string;
}

// دالة آمنة لاستخراج رابط الصورة
function getImageUrl(imageProp: unknown): string {
  if (!imageProp) return "/images/placeholders/product.webp";
  if (typeof imageProp === "string") return imageProp;
  
  if (typeof imageProp === "object" && imageProp !== null) {
    const media = imageProp as { url?: string; path?: string; original_url?: string };
    return media.url ?? media.original_url ?? media.path ?? "/images/placeholders/product.webp";
  }

  return "/images/placeholders/product.webp";
}

// 👈 توسيع نوع المدخلات ليقبل Product أو SectionItem أو أي كائن بيانات مشابه
export function mapCmsProducts(
  products: (Product<string> | SectionItem<string> | Record<string, any>)[] | null | undefined,
  lang: string
): CmsProductCardViewModel[] {
  if (!Array.isArray(products)) return [];

  return products.map((product) => {
    // 1. استخراج السعر بأمان مع مراعاة كافة الاحتمالات
    const rawPrice =
      product.price ??
      product.starting_at ??
      (Array.isArray(product.variants) ? product.variants?.[0]?.price : undefined);

    // 2. استخراج الصورة المناسبة
    const rawImage = product.featured_image ?? product.thumbnail ?? product.image;

    // 3. معالجة الاسم (سواء كان نصاً مباشراً أو كائن ترجمة)
    const name = typeof product.name === "object" && product.name !== null
      ? (product.name[lang] || product.name["en"] || Object.values(product.name)[0] || "")
      : (product.name ?? "");

    // 4. معالجة الوصف
    const description = typeof product.description === "object" && product.description !== null
      ? (product.description[lang] || product.description["en"] || "")
      : product.description;

    return {
      id: product.id,
      slug: product.slug,
      name: String(name),
      description: description ? String(description) : undefined,
      image: getImageUrl(rawImage),
      price: rawPrice !== undefined && rawPrice !== null ? Number(rawPrice) : 0,
      link: `/products/${product.slug ?? product.id}`,
    };
  });
}