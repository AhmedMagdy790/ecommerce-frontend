// src/pages/Checkout/schemas/paymentSchema.ts

import { z } from "zod";

export const paymentSchema = z.object({
  payment_gateway_id: z.coerce.number().int().positive(),

  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;