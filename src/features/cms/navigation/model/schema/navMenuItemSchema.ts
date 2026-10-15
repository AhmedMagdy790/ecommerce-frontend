// src/features/cms/navigation/model/schema/navMenuItemSchema.ts
import { z } from "zod";
import { createTranslatedSchema } from "@/shared/utils/schemas";

export const navMenuItemSchema = z.object({
  nav_menu_id: z
    .number("رقم القائمة مطلوب")
    .positive("رقم القائمة غير صالح"),

  title: createTranslatedSchema(
    true,
    "عنوان عنصر القائمة مطلوب باللغة الأساسية"
  ),

  page_id: z
    .number()
    .nullable()
    .optional(),

  url: z
      .string()
      .refine(
        (val) => !val || val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
        { message: "الرابط المخصص غير صالح (يجب أن يبدأ بـ / أو رابط كامل)" }
      )
      .nullable()
      .optional()
      .or(z.literal("")),

  parent_id: z
    .number()
    .nullable()
    .optional(),

  sort_order: z
    .number()
    .int()
    .default(0),

  is_active: z
    .boolean()
    .default(true),
}).refine((data) => {
  // 💡 قاعدة مخصصة (Custom Validation):
  // لا يمكن اختيار (صفحة) ووضع (رابط مخصص) في نفس الوقت لتجنب التضارب.
  if (data.page_id && data.url && data.url.trim() !== "") {
    return false;
  }
  return true;
}, {
  message: "لا يمكن اختيار صفحة وإدخال رابط مخصص في نفس الوقت.",
  path: ["url"],
});

export type NavMenuItemFormData = z.infer<typeof navMenuItemSchema>;
export type NavMenuItemFormInput = z.input<typeof navMenuItemSchema>;