import { createTranslatedSchema } from "@/shared/utils/schemas";
import { z } from "zod";


export const countrySchema = z.object({
  name: createTranslatedSchema(),
  code: z.string().min(2, "رمز الدولة يجب أن يكون حرفين على الأقل").max(3, "رمز الدولة لا يمكن أن يتجاوز 3 أحرف"),
  phone_code: z.string().min(1, "مفتاح الهاتف مطلوب"),
  is_active: z.boolean().optional(),
});

export type CountryFormData = z.infer<typeof countrySchema>;
export type CountryFormInput = z.input< typeof countrySchema>;