import { z } from 'zod';

export const addressSchema = z.object({
  shipping_address: z
    .string()
    .trim()
    .min(3, "Street address is required")
    .max(500, "Address is too long"),

  shipping_address2: z
    .string()
    .trim()
    .max(500, "Address is too long")
    .optional()
    .or(z.literal('')),

  city_id: z.number().int().positive(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;