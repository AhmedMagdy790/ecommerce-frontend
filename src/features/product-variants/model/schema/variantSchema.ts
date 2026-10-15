import { z } from "zod";

// ==========================================
// 2. Attribute & Variant Schemas
// ==========================================
export const attributeSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  key: z.string().min(1, "اسم الخصيصة مطلوب"),
  value: z.string().min(1, "قيمة الخصيصة مطلوبة"),
});

export const variantSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  sku: z.string().min(1, "SKU مطلوب"),
  price: z.number().min(0, "السعر يجب أن يكون أكبر من أو يساوي صفر"),
  stock: z.number().min(0, "المخزون يجب أن يكون أكبر من أو يساوي صفر"),
  status: z.enum(["active", "inactive"]),
  attributes: z.array(attributeSchema).optional(),
  weight: z.number().nullable().optional(),
  length: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
});


export type variantFormData = z.infer<typeof variantSchema>;
export type variantFormInput = z.input<typeof variantSchema>;