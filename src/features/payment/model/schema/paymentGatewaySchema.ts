import { createTranslatedSchema } from "@/shared/utils/schemas";
import { z } from "zod";

export const paymentGatewaySchema = z.object({
  name: createTranslatedSchema(),
  slug: z.string().min(1, "معرّف البوابة (Slug) مطلوب"),
  type: z.string().min(1, "نوع بوابة الدفع مطلوب"),
  description: createTranslatedSchema().nullable().optional(),
  credentials: z.record(z.string(), z.any()).nullable().optional(),
  is_active: z.boolean().optional(),
  is_test_mode: z.boolean().optional(),
  icon_name: z.string().nullable().optional(),
  extra_fees: z.number().min(0, "الرسوم الإضافية لا يمكن أن تكون سالبة").optional(),
  logo: z.any().nullable().optional(),

  supported_currencies: z.array(z.string().min(1))
  .optional()
  .default([]),

  min_amount: z.number()
    .min(0, "الحد الأدنى لا يمكن أن يكون سالبًا")
    .nullable()
    .optional(),

  max_amount: z.number()
    .min(0, "الحد الأقصى لا يمكن أن يكون سالبًا")
    .nullable()
    .optional(),

  allows_digital: z.boolean().optional(),
  allows_physical: z.boolean().optional(),

  country_ids: z.array(z.number().int().positive())
    .optional()
    .default([]),
});

export type PaymentGatewayFormData = z.infer<typeof paymentGatewaySchema>;
export type PaymentGatewayFormInput = z.input<typeof paymentGatewaySchema>;