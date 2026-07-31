import { z } from "zod";

export const citySchema = z.object({
  country_id: z.preprocess((val) => Number(val), z.number().min(1, "يجب اختيار الدولة").optional()),
  name_ar: z.string().min(2, "الاسم بالعربية مطلوب"),
  name_en: z.string().min(2, "English name is required"),
  city_code: z.string().optional(),
  is_active: z.boolean().default(true),
  // حقول اختيارية للشحن عند الإضافة
  shipping_cost: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  delivery_time: z.string().optional(),
});

export type CityFormData = z.infer<typeof citySchema>;