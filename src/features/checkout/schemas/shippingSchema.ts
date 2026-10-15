import { z } from 'zod';

export const shippingSchema = z.object({
  shipping_rate_id: z.coerce.number().int().positive(),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;