import { z } from "zod";

export const updateUserSchema = z.object({
  current_password: z.string().min(8, "كلمة المرور الحالية يجب أن تكون 8 أحرف على الأقل").optional().or(z.literal("")),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل").optional().or(z.literal("")),
  password_confirmation: z.string().optional().or(z.literal("")),
}).refine((data) => data.password === data.password_confirmation, {
  message: "كلمة المرور غير متطابقة",
  path: ["password_confirmation"],
});


export type UpdateUserFormData = z.infer<typeof updateUserSchema>;