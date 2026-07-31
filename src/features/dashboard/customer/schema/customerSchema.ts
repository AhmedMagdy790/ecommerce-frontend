import { z } from "zod";



export const customerSchema = z.object({
  name: z
    .string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .max(50, "الاسم طويل جداً"),
  
  phone: z
    .string()
    .min(10, "رقم الهاتف غير صحيح"),

  email: z
    .string()
    .email("بريد إلكتروني غير صالح")
    .optional()
    .or(z.literal("")), // يسمح بأن يكون الحقل فارغاً

  city_id: z
    .number({ required_error: "يرجى اختيار المحافظة" })
    .positive("يرجى اختيار المحافظة"),

  country_id:  z
    .number({ required_error: "يرجى اختيار المدينة اولا" })
    .positive("يرجى اختيار المدينة"),

  street_details: z
    .string()
    .min(5, "يرجى كتابة تفاصيل العنوان بشكل أوضح")
    .max(255, "العنوان طويل جداً"),

  // العنوان المختصر ( اختياري حسب حاجتك)
  area: z
    .string()
    .optional()
    .or(z.literal("")),

  // نوع العنوان (home, work, etc.)
  type: z
    .enum(["home", "work", "other"], {
        errorMap: () => ({ message: "يرجى اختيار نوع العنوان" })
    })
    .default("home"),


  // حقل اختياري إذا أردت السماح بتعيين كلمة سر يدوياً
  password: z
    .string()
    .min(6, "كلمة السر يجب أن تكون 6 أحرف على الأقل")
    .optional()
    .or(z.literal("")),
});

// استخراج النوع (Type) من الـ Schema لاستخدامه في TypeScript
export type CustomerInput = z.infer<typeof customerSchema>;