// src/features/order/model/types/order.dto.ts
import { z } from "zod";

// سكيما عنصر الطلب (OrderItem)
export const orderItemSchema = z.object({
  product_variant_id: z.number({ error: "معرف المنتج مطلوب" }),
  quantity: z.number().min(1, "الكمية يجب أن تكون على الأقل 1"),
});

// سكيما إنشاء الطلب (CreateOrderDto) تتطابق تماماً مع الـ Backend DTO
export const orderSchema = z.object({
  user_id: z.number().optional().nullable(),
  customer_name: z.string().min(2, "اسم العميل مطلوب"),
  phone_primary: z.string().min(10, "رقم الهاتف الرئيسي مطلوب"),
  phone_secondary: z.string().optional().nullable(),
  customer_email: z.string().email("البريد الإلكتروني غير صالح").optional().nullable(),

  shipping_address: z.string().min(3, "العنوان التفصيلي مطلوب"),
  shipping_address2: z.string().optional().nullable(),
  city_id: z.number({ error: "المدينة مطلوبة" }),
  
  shipping_rate_id: z.number({ error: "سعر وطريقة الشحن مطلوبة" }),
  payment_gateway_id: z.number({ error: "بوابة الدفع مطلوبة" }),

  coupon_code: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  idempotency_key: z.string().uuid("مفتاح التكرار غير صالح"),

  items: z.array(orderItemSchema).min(1, "يجب أن يحتوي الطلب على عنصر واحد على الأقل"),
});


export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderFormInput = z.input<typeof orderSchema>;

// سكيما خاصة بتحديث حالة الطلب والدفع في الـ Admin
export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "completed", "cancelled", "returned"]),
  payment_status: z.enum(["paid", "unpaid", "failed", "refunded"]).optional(),
  notes: z.string().optional().nullable(),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;