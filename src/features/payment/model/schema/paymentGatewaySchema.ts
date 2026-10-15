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
  logo: z.any().nullable().optional(), // مخصص لملف الشعار (File) في الـ Form
});

export type PaymentGatewayFormData = z.infer<typeof paymentGatewaySchema>;
export type PaymentGatewayFormInput = z.input<typeof paymentGatewaySchema>;