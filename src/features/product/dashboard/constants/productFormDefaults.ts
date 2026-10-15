import { defaultTranslatedText } from "@/shared/constants/default";
import type { ProductFormData } from "../../model/schema/productSchema";

export const defaultValues: ProductFormData = {
  id: undefined,
  name: defaultTranslatedText,
  description: defaultTranslatedText,
  status: "active",
  is_featured: false,
  brand_id: "",
  category_id: "",
  variants: [],
  featured_image: null,
  gallery: [],
  remove_images: [],
};