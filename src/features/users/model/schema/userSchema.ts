// src/features/users/dashboard/model/schema/userSchema.ts

import { z } from "zod";

export const userStatusEnum = z.enum(["active", "pending", "suspended"]);

export const userSchema = z
  .object({
    name: z.string().min(2, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    phone: z.string().optional().nullable(),
    status: userStatusEnum.default("active"),
    roles: z.array(z.union([z.string(), z.number()])).default([]),
    avatar: z.string().optional().nullable(),
    password: z.string().optional().or(z.literal("")),
    password_confirmed: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // 1. التحقق من طول كلمة المرور فقط عند كتابتها
    if (data.password && data.password.length > 0 && data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        path: ["password"],
      });
    }

    // 2. التحقق من تطابق كلمتي المرور
    if (data.password && data.password !== data.password_confirmed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "كلمة المرور غير متطابقة",
        path: ["password_confirmation"],
      });
    }
  });

export type UserFormData = z.infer<typeof userSchema>;
export type UserFormInput = z.input<typeof userSchema>;