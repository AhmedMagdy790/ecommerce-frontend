import { z } from "zod";

/**
 * Attribute Schema (داخل الفورم)
 */
const attributeSchema = z.object({
  id: z.number().optional(),
  key: z
    .string()
    .min(1, "اسم الصفة مطلوب")
    .max(50, "اسم الصفة طويل جدًا"),
  value: z
    .string()
    .min(1, "قيمة الصفة مطلوبة")
    .max(100, "القيمة طويلة جدًا"),
});

/**
 * Variant Schema
 */
const variantSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),

  sku: z
    .string()
    .min(1, "SKU مطلوب")
    .max(100, "SKU طويل جدًا"),

  price: z
    .number({
      message: "السعر يجب أن يكون رقم",
    })
    .min(0, "السعر لا يمكن أن يكون سالب"),

  stock: z
    .number({
      message: "المخزون يجب أن يكون رقم",
    })
    .int("المخزون يجب أن يكون رقم صحيح")
    .min(0, "المخزون لا يمكن أن يكون سالب"),

  status: z.enum(["active", "inactive"]),

  attributes: z
    .array(attributeSchema)
    .default([]),
});

/**
 * Product Schema
 */
export const productSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),

  name: z
    .string()
    .min(2, "اسم المنتج قصير جدًا")
    .max(255, "اسم المنتج طويل جدًا"),

  description: z
    .string()
    .min(5, "الوصف قصير جدًا")
    .max(5000, "الوصف طويل جدًا"),

  brand: z
    .string()
    .min(1, "الماركة مطلوبة")
    .max(100, "اسم الماركة طويل جدًا"),

  category_id: z
    .string()
    .min(1, "يجب اختيار قسم"),

  status: z.enum(["active", "archived", "draft"]),

  /**
   * Variants
   */
  variants: z
    .array(variantSchema)
    .min(1, "يجب إضافة متغير واحد على الأقل")
    .superRefine((variants, ctx) => {
      const skuSet = new Set<string>();

      variants.forEach((variant, index) => {
      
        if (skuSet.has(variant.sku)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "SKU مكرر",
            path: [index, "sku"],
          });
        }

        skuSet.add(variant.sku);

        // منع تكرار keys داخل نفس الـ variant
        const keys = new Set<string>();

        (variant.attributes || []).forEach((attr, attrIndex) => {
          if (keys.has(attr.key)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "اسم الصفة مكرر",
              path: [index, "attributes", attrIndex, "key"],
            });
          }

          keys.add(attr.key);
        });
      });
    }),

  /**
   * Product Attributes العامة (اختياري)
   */
  // attributes: z.record(z.string()).optional().default({}),

  /**
   * Media
   */
  featured_image: z.any().nullable().optional(),

  gallery: z.array(z.any()).optional().default([]),

  remove_images: z.array(z.number()).optional().default([]),
});

/**
 * TypeScript Type
 */
export type ProductFormData = z.infer<typeof productSchema>;