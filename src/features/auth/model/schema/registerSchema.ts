import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  password_confirmed: z.string().min(8, "تأكيد كلمة المرور مطلوب"),
  roles: z.array(z.string()).optional(),
  avatar: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
}).refine((data) => data.password === data.password_confirmed, {
  message: "كلمة المرور غير متطابقة",
  path: ["password_confirmed"],
});

export type Register = z.infer<typeof registerSchema>;