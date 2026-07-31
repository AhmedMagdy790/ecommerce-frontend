// src/pages/Checkout/types/checkout.ts

import { z } from "zod";
import { contactSchema } from "../schemas/contactSchema";
import { addressSchema } from "../schemas/addressSchema";
import { shippingSchema } from "../schemas/shippingSchema";
import { paymentSchema } from "../schemas/paymentSchema";

// Combine individual schemas and align items to match backend requirements
export const checkoutFormSchema = z.object({
  ...contactSchema.shape,
  ...addressSchema.shape,
  ...shippingSchema.shape,
  ...paymentSchema.shape,
  
  // Align items structure with the backend request validation
  // items: z.array(
  //   z.object({
  //     product_variant_id: z.number({ required_error: "Product variant ID is required" }),
  //     quantity: z.number().min(1, "Quantity must be at least 1"),
  //   })
  // ).min(1, "At least one item is required"),

  idempotency_key: z.string().min(1, "Idempotency key is required"),

  coupon_code: z.string().optional().or(z.literal("")),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().or(z.literal("")),
  user_id: z.number().int().positive().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export interface ShippingDetails {
  id: number;
  currency: string;
  base_weight: number;
  extra_per_kg: number;
  max_weight: number;
  shipping_fee: number;
  cod_fee: number;
  base_cost: number;
  free_shipping_threshold: number;
  estimated_delivery_from: number;
  estimated_delivery_to: number;
  is_active: boolean;
}

// src/pages/Checkout/types/checkout.ts

// src/pages/Checkout/types/checkout.ts

export interface ShippingOption {
  id: number;
  shipping_rate_id?: number;
  code: string;
  name: Record<string, string> | string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  supports_cod?: boolean;
  is_active?: boolean;

  courier?: {
    id: number;
    name: Record<string, string> | string;
    logo?: string | null;
  };

  rates?: {
    cod_fee: string | number;
    cost: string | number;
    delivery_days: number;
    delivery_time: number;
    final_price: string | number;
  };

  shipping_details?: {
    base_cost: string | number;
    base_weight: string | number;
    cod_fee: string | number;
    currency: string;
    estimated_delivery_from: number;
    estimated_delivery_to: number;
    extra_per_kg: string | number;
    free_shipping_threshold: string | number;
    is_active: boolean;
    max_weight: string | number;
    shipping_fee: string | number;
  };

  created_at?: string;
  updated_at?: string;
}



export interface ShippingDetails {
  shipping_fee: number;
  cod_fee: number;
  estimated_delivery_from: number;
  estimated_delivery_to: number;
  currency: string;
}