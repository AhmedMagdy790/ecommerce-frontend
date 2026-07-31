import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح").min(1, "البريد مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});



export const registerSchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  password_confirmed: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
}).refine((data) => data.password === data.password_confirmed, {
  message: "كملة المرور لا تتطابق",
  path: ['password_confirmed'],
});;