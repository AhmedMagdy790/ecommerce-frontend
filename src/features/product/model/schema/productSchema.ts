// src/features/product/schema/productSchema.ts
import { variantSchema } from "@/features/product-variants/model/schema/variantSchema";
import { createTranslatedSchema } from "@/shared/utils/schemas";
import { z } from "zod";
import { ProductStatus } from "../types/product.types";


// ==========================================
// 3. Main Product Schema (Dynamic & Unified)
// ==========================================
export const productSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  
  // مثال على تمرير رسالة مخصصة لاسم المنتج أو الوصف عند الحاجة:
  name: createTranslatedSchema(true, "اسم المنتج باللغة الأساسية مطلوب"),
  description: createTranslatedSchema(false),

  category_id: z.union([z.string(), z.number()])
    .refine((val) => String(val).trim() !== "", {
      message: "التصنيف مطلوب",
    }),

  brand_id: z.union([z.string(), z.number()]).optional(),
  
  status: z.enum(ProductStatus),
  
  is_featured: z.boolean().default(false).transform((val) => Boolean(val)),
  
  variants: z.array(variantSchema).min(1, "يجب إضافة متغير واحد على الأقل للمنتج"),
  
  featured_image: z.any().nullable().optional(),
  gallery: z.array(z.any()).default([]),
  remove_images: z.array(z.number()).default([]),
});

// ==========================================
// 4. Types Export
// ==========================================
export type ProductFormData = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;