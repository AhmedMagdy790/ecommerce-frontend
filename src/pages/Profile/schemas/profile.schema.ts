import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(3),

  email: z.email(),

  phone: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;