import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  phone: z
  .string()
  .optional()
  .or(z.literal('')) 
  .refine((val) => !val || /^[0-9]+$/.test(val), {
    message: "يجب أن يحتوي رقم الهاتف على أرقام فقط",
  })
  .refine((val) => !val || val.length >= 10, {
    message: "رقم الهاتف قصير جداً، يجب أن يكون 10 أرقام على الأقل",
  }),
  address: z.string().max(500, "العنوان طويل جداً").nullable().optional(),
  avatar: z.any().optional(), 
});


export const updatePasswordSchema = z.object({
  current_password: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  password: z.string()
    .min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
  password_confirmation: z.string()
    .min(1, "يرجى تأكيد كلمة المرور الجديدة"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "كلمة المرور غير متطابقة",
  path: ["password_confirmation"], // سيظهر الخطأ تحت حقل التأكيد
}).refine((data) => data.password !== data.current_password, {
  message: "كلمة المرور الجديدة يجب أن تختلف عن الحالية",
  path: ["password"],
});


export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;