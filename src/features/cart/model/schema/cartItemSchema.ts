import { z } from "zod";

export const cartItemSchema = z.object({
  product_variant_id: z.number().or(z.string()).refine((val) => Number(val) > 0, {
    message: "معرف متغير المنتج مطلوب",
  }),
  quantity: z.number().int().positive("الكمية يجب أن تكون أكبر من الصفر").default(1),
});