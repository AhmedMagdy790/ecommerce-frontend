import * as z from "zod";

export const paymentSchema = z.object({
  // طريقة الدفع المختارة (تأتي من الـ slug في قاعدة البيانات)
  payment_method: z.string({
    required_error: "يرجى اختيار طريقة الدفع",
  }),

  // معرف العملية (يستخدم فقط عند الدفع بالبطاقة/المحافظ)
  payment_id: z.string().optional(),

  // المبالغ المالية (للعرض والتحقق)
  sub_total: z.number().min(0),
  shipping_cost: z.number().min(0),
  total_amount: z.number().min(0),

  // حقول إضافية قد تطلبها بوابة دفع معينة ديناميكياً
  card_details: z.object({
    holder_name: z.string().min(3).optional(),
    // ملاحظة: لا تخزن أرقام البطاقات الكاملة في الـ State الخاص بك لأسباب أمنية (PCI DSS)
    // عادة يتم التعامل معها عبر الـ SDK الخاص ببوابة الدفع (مثل Stripe Elements)
  }).optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;