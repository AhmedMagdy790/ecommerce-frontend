import { z } from 'zod';

export const contactSchema = z.object({
  customer_name: z
  .string()
  .trim()
  .min(1, "Customer name is required")
  .max(255),
  // customer_type: z.string()
  //   .trim()
  //   .min(1, "Customer type is required")
  //   .max(255),
  phone_primary: z
    .string()
    .trim()
    .min(8, "Minimum 8 characters")
    .max(20),
  phone_secondary: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .optional()
    .or(z.literal('')),
  customer_email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal('')),
});