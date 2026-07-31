import { z } from 'zod';

export const addressSchema = z.object({
  shipping_address: z
    .string()
    .min(3, "Street address is required")
    .max(500, "Address is too long"),
  shipping_address2: z.string().max(500, "Address is too long").optional(),
  city_id: z.number().int().positive("Invalid city selected"),
});