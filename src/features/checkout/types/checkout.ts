// src/pages/Checkout/types/checkout.ts

import { z } from "zod";
import { contactSchema } from "../schemas/contactSchema";
import { addressSchema } from "../schemas/addressSchema";
import { shippingSchema } from "../schemas/shippingSchema";
import { paymentSchema } from "../schemas/paymentSchema";

// دمج الـ Schemas الرئيسية
export const checkoutFormSchema = z.object({
  ...contactSchema.shape,
  ...addressSchema.shape,
  ...shippingSchema.shape,
  ...paymentSchema.shape,

  idempotency_key: z.string().min(1, "Idempotency key is required"),

  coupon_code: z.string().optional().or(z.literal("")),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().or(z.literal("")),
  user_id: z.number().int().positive().optional(),

  items: z.array(
    z.object({
      product_variant_id: z.number().int().positive(),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one item is required"),
});

// نوع البيانات بعد الـ Validation والـ Coercion (تستخدم عند الـ Submit ولإرسال البيانات)
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// نوع البيانات المدخلة في الـ Form UI (تستخدم لتهيئة useForm إذا احتجت للتعامل مع الـ inputs)
export type CheckoutFormInput = z.input<typeof checkoutFormSchema>;

export interface CreateCheckoutPayload {
  customer_name: string;
  phone_primary: string;
  phone_secondary?: string;
  customer_email?: string;

  shipping_address: string;
  shipping_address2?: string;
  city_id: number;

  shipping_rate_id: number;
  payment_gateway_id: number;

  coupon_code?: string;
  notes?: string;

  items: {
    product_variant_id: number;
    quantity: number;
  }[];
}