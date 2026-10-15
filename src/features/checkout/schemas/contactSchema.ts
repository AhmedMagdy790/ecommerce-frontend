import { z } from 'zod';

export const contactSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(1, "Customer name is required")
    .max(255, "Name is too long"),

  phone_primary: z
    .string()
    .trim()
    .min(8, "Minimum 8 characters required for phone")
    .max(20, "Phone number is too long"),

  phone_secondary: z
    .string()
    .trim()
    .min(8, "Minimum 8 characters required for secondary phone")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal('')),

  customer_email: z
    .string()
    .trim()
    .email("Invalid email address format")
    .optional()
    .or(z.literal('')),
});

export type ContactFormValues = z.infer<typeof contactSchema>;