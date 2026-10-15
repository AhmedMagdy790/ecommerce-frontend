import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  password_confirmation: z.string().min(8, "تأكيد كلمة المرور مطلوب"),
  roles: z.array(z.string()).optional(),
  avatar: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "كلمة المرور غير متطابقة",
  path: ["password_confirmation"],
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل").optional().or(z.literal("")),
  password_confirmation: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.password && data.password !== "" && data.password !== data.password_confirmation) {
    return false;
  }
  return true;
}, {
  message: "كلمة المرور غير متطابقة",
  path: ["password_confirmation"],
});

// استخراج أنواع الـ TypeScript تلقائياً من الـ Zod Schema بدون أي استخدام لـ any أو as
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;