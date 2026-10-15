import { z } from "zod";

export const addressSchema = z.object({
  country_id: z
    .union([
      z.number().int(),
      z.string().regex(/^\d+$/, "يجب أن يكون رقمًا صحيحًا"),
    ])
    .transform((val) => Number(val)),

  city_id: z
    .union([
      z.number().int(),
      z.string().regex(/^\d+$/, "يجب أن يكون رقمًا صحيحًا"),
    ])
    .transform((val) => Number(val)),

  type: z.string().min(1, "نوع العنوان مطلوب").default("home"),

  street_details: z.string().min(3, "تفاصيل الشارع مطلوبة ويجب أن تكون 3 أحرف على الأقل"),

  area: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),

  building_number: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),

  phone_contact: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),

  is_default: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export type AddressFormInput = z.input<typeof addressSchema>;