import { z } from 'zod';

// Define the OrderItem Schema first to nest it later
const orderItemSchema = z.object({
  product_variant_id: z.number().int().positive("Invalid product variant"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  // Note: Price and total are usually calculated on the server for security,
  // but included here if your frontend sends them for UI previews.
  price: z.number().nonnegative().optional(),

  weight: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),

  total_weight: z.number().optional(),
  max_stock: z.number().optional(),

});

export const orderSchema = z.object({
  // Customer Info
  customer_id: z.number().nullable().optional(),
  customer_name: z.string().min(2, "Name is too short").max(255).nullable().optional(),
  phone_primary: z.string().min(7, "Primary phone is required").max(20),
  phone_secondary: z.string().max(20).nullable().optional(),
  customer_email: z.string().email("Invalid email address").nullable().optional(),
  customer_type: z.string().nullable().optional(),

  shipping_cost: z.number().nullable().optional(),
  sub_total: z.number().nullable().optional(),

  // Location & Shipping
  shipping_address: z.string().min(10, "Please provide a full address"),
  // city_id: z.number().int().positive("City is required"),
  city_id: z
    .number({ required_error: "City is required" })
    .positive()
    .nullable()
    .refine((val) => val !== null, { message: "City is required" }),
  country_id: z
    .number({ required_error: "Country is required" })
    .positive()
    .nullable()
    .refine((val) => val !== null, { message: "Country is required" }),
  shipping_courier_id: z.number().int().positive("Courier is required"),
  
  // Payment
  payment_method: z.enum(['cod', 'card', 'wallet', 'stripe', 'paypal'], {
    errorMap: () => ({ message: "Please select a valid payment method" }),
  }),
  
  // Items
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),

  // Metadata
  notes: z.string().max(1000).nullable().optional(),
  coupon_code: z.string().nullable().optional(),
});

// Type inference for TypeScript
export type OrderFormData = z.infer<typeof orderSchema>;