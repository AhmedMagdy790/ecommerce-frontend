// src/features/auth/model/schema/loginSchema.ts

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

// استخراج نوع الـ TypeScript تلقائياً من الـ Zod Schema
export type LoginFormData = z.infer<typeof loginSchema>;