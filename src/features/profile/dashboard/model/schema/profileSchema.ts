import { z } from "zod";

// 1. سكيما تحديث البيانات الشخصية (Profile Info)
export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormData = z.output<typeof profileSchema>;

// 2. سكيما تغيير كلمة المرور من لوحة الملف الشخصي (Password Change)
export const passwordSchema = z.object({
  current_password: z.string().min(6, "Current password is required"),
  password: z.string().min(6, "New password must be at least 6 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export type PasswordFormInput = z.input<typeof passwordSchema>;
export type PasswordFormData = z.output<typeof passwordSchema>;