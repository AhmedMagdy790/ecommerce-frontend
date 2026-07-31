import z from "zod";

export const countrySchema = z.object({
  name_ar: z.string().min(2, "الاسم بالعربية مطلوب (على الأقل حرفين)"),
  name_en: z.string().min(2, "English name is required (at least 2 chars)"),
  code: z.string()
    .min(2, "كود الدولة حرفين على الأقل")
    .max(5, "كود الدولة طويل جداً"),
    
  phone_code: z.string().min(1, "كود الهاتف مطلوب"),
  
  is_active: z.boolean().default(true),
  
});

export type CountryFormData = z.infer<typeof countrySchema>;