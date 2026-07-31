import { z } from "zod";

/**
 * 1. Helper Helpers
 */
const emptyToNull = z
  .string()
  .transform((val) => (val === "" || val === null || val === undefined ? null : val))
  .nullable()
  .optional();

/**
 * 2. Shipping Courier Types & Schema
 */
export const shippingCourierSchema = z.object({
  name: z.object({
    ar: z.string().min(2, "الاسم بالعربية قصير جدًا").max(100, "الاسم طويل جداً"),
    en: z.string().max(100, "الاسم طويل جداً").optional().nullable().transform((val) => (val === "" ? null : val)),
  }),
  description: emptyToNull,
  code: z.string().min(2).max(50).regex(/^[a-z0-9_-]+$/, "يجب أن يكون lowercase بدون مسافات"),
  phone: emptyToNull,
  email: z.string().email().pipe(emptyToNull),
  driver: emptyToNull,
  api_endpoint: z.preprocess((val) => (val === "" ? null : val), z.string().nullable()),
  api_key: emptyToNull,
  tracking_url: z.string().url().pipe(emptyToNull),
  is_active: z.boolean().default(true),
  supports_cod: z.boolean().default(false),
});

export type ShippingCourierFormData = z.infer<typeof shippingCourierSchema>;

export interface IShippingCourier extends ShippingCourierFormData {
  id: number;
  created_at: string;
  updated_at: string;
  logo_url?: string | null;
}

/**
 * 3. Shipping Rate Types & Schema
 */
export const shippingRateSchema = z.object({
  id: z.number().nullable().optional(),
  
  // الربط بين المدينة وشركة الشحن
  city_id: z.coerce.number({ required_error: "City is required" }).min(1),
  shipping_courier_id: z.coerce.number({ required_error: "Courier is required" }).min(1),
  country_id: z.coerce.number().optional(),
  currency: z.string().default("EGP"),
  
  // الحقول المالية (مع التحقق من القيمة الدنيا 0)
  base_cost: z.coerce.number().min(0, "Base cost cannot be negative"),
  shipping_fee: z.coerce.number().min(0, "Shipping fee cannot be negative"),
  cod_fee: z.coerce.number().min(0, "COD fee cannot be negative"),
  extra_per_kg: z.coerce.number().min(0, "Extra fee cannot be negative"),
  free_shipping_threshold: z.coerce.number().min(0, "Threshold cannot be negative"),
  
  // حقول الوزن والتوصيل
  base_weight: z.coerce.number().min(0, "Weight cannot be negative"),
  max_weight: z.coerce.number().min(0, "Weight cannot be negative"),
  estimated_delivery_from: z.coerce.number().int().min(1, "Min 1 day").max(30),
  estimated_delivery_to: z.coerce.number().int().min(1, "Min 1 day").max(30),
  
  is_active: z.boolean().default(true),
}).superRefine((data, ctx) => {
  // التحقق من أن الحد الأقصى للوزن >= الوزن الأساسي
  if (data.max_weight < data.base_weight) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Max weight must be greater than or equal to base weight",
      path: ["max_weight"],
    });
  }
  
  // التحقق من أن مدة التوصيل القصوى >= الصغرى
  if (data.estimated_delivery_to < data.estimated_delivery_from) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be greater than start date",
      path: ["estimated_delivery_to"],
    });
  }
});

export type ShippingRateFormData = z.infer<typeof shippingRateSchema>;

/**
 * 4. Default Values (For React Hook Form)
 */
export const shippingCourierDefaultValues: ShippingCourierFormData = {
  name: {
    ar: "",
    en: "",
  },
  code: "",
  description: null,
  phone: null,
  email: null,
  driver: null,
  api_endpoint: null,
  api_key: null,
  tracking_url: null,
  is_active: true,
  supports_cod: false,
};

export const shippingRateDefaultValues: ShippingRateFormData = {
  shipping_courier_id: 0,
  city_id: 0,
  currency: "EGP",
  shipping_fee: 0,
  cod_fee: 0,
  base_cost: 0,
  base_weight: 1,
  max_weight: 50,
  extra_per_kg: 0,
  free_shipping_threshold: 0,
  estimated_delivery_from: 1,
  estimated_delivery_to: 3,
  is_active: true,
};

export const shippingCitySchema = z.object({
  country_id: z.number().min(1, "Country is required"),
  city_id: z.number().min(1, "City is required"),
  courier_id: z.number().min(1, "Courier is required"),
  shipping_cost: z.number().min(0, "Cost must be a positive number"),
  is_active: z.boolean().default(true),
});

export type ShippingCityFormData = z.infer<typeof shippingCitySchema>;