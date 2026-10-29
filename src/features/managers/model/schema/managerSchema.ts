import { z } from "zod";

export const managerStatusEnum = z.enum(["active", "pending", "suspended"]);

export const managerSchema = z
  .object({
    mode: z.enum(["select", "create"]).default("select"),

    user_id: z.union([z.string(), z.number()]).optional().nullable(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    avatar: z.union([z.instanceof(File), z.string()]).optional().nullable(),

    status: managerStatusEnum.default("active"),
    roles: z.array(z.union([z.string(), z.number()])),

    password: z.string().optional().or(z.literal("")),
    password_confirmation: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // -------------------------------------------------------------
    // 1. التحقق العام المشترك (يُطبق في جميع الحالات select / create / edit)
    // -------------------------------------------------------------
    
    // أ) التأكد من اختيار دور/صلاحية واحدة على الأقل
    if (!data.roles || data.roles.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "يجب تحديد دور/صلاحية واحدة على الأقل",
        path: ["roles"],
      });
    }

    // ب) الاسم مطلوب دائماً (سواء تم اختيار مستخدم أو إنشاؤه)
    if (!data.name || data.name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "الاسم مطلوب ويجب أن يكون حرفين على الأقل",
        path: ["name"],
      });
    }

    // ج) البريد الإلكتروني مطلوب وصالح دائماً
    if (!data.email || !z.string().email().safeParse(data.email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "البريد الإلكتروني غير صالح",
        path: ["email"],
      });
    }

    // -------------------------------------------------------------
    // 2. التحقق الخاص بوضع اختيار مستخدم حالي (select)
    // -------------------------------------------------------------
    if (data.mode === "select" && !data.user_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "يرجى اختيار مستخدم من القائمة",
        path: ["user_id"],
      });
    }

    // -------------------------------------------------------------
    // 3. التحقق الخاص بكلمة المرور في وضع إنشاء مستخدم جديد فقط (create)
    // -------------------------------------------------------------
    if (data.mode === "create") {
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
          path: ["password"],
        });
      }

      if (data.password && data.password !== data.password_confirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "كلمة المرور غير متطابقة",
          path: ["password_confirmation"],
        });
      }
    }
  });

export type ManagerFormData = z.infer<typeof managerSchema>;
export type ManagerFormInput = z.input<typeof managerSchema>;