import { createTranslatedSchema } from "@/shared/utils/schemas";
import { z } from "zod";

export const navMenuSchema = z.object({
  name: createTranslatedSchema(true),

  location: z
    .string()
    .min(1, "موقع القائمة (Location) مطلوب")
    .max(50, "موقع القائمة طويل جداً"),

  is_active: z
    .boolean()
    .default(true),
});

export type NavMenuFormData = z.infer<typeof navMenuSchema>;
export type NavMenuFormInput = z.input<typeof navMenuSchema>;