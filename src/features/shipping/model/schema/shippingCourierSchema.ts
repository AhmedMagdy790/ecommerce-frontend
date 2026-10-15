// src/features/shipping/model/schema/shippingCourierSchema.ts
import { z } from "zod";
import { createTranslatedSchema } from "@/shared/utils/schemas";

export const shippingCourierSchema = z.object({
  name: createTranslatedSchema(
    true,
    "اسم شركة الشحن مطلوب باللغة الأساسية"
  ),

  code: z
    .string()
    .min(1, "رمز الشركة مطلوب")
    .max(50, "رمز الشركة طويل جداً"),

  phone: z
    .string()
    .nullable()
    .optional(),

  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .nullable()
    .optional(),

  api_endpoint: z
    .string()
    .url("رابط الـ API غير صالح")
    .nullable()
    .optional()
    .or(z.literal("")),

  api_key: z
    .string()
    .nullable()
    .optional(),

  // في ملف الschema
  description: createTranslatedSchema(false),

  supports_cod: z
    .boolean()
    .default(false),

  tracking_url: z
    .string()
    .url("رابط التتبع غير صالح")
    .nullable()
    .optional()
    .or(z.literal("")),

  is_active: z
    .boolean()
    .default(true),

  driver: z
    .string()
    .nullable()
    .optional(),

  logo: z
    .union([
      z.string(),
      z.instanceof(File),
    ])
    .nullable()
    .optional(),
});

export type ShippingCourierFormData =
  z.infer<typeof shippingCourierSchema>;

export type ShippingCourierFormInput =
  z.input<typeof shippingCourierSchema>;