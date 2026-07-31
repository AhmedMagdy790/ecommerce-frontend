// src/pages/Checkout/schemas/paymentSchema.ts

import { z } from "zod";

export const paymentSchema = z.object({
  payment_method: z.string().min(1, "Payment method is required"),
  notes: z.string().max(500, "Notes are too long").optional().or(z.literal("")),
});