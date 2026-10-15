import { createTranslatedSchema } from "@/shared/utils/schemas";
import { z } from "zod";

export const citySchema = z.object({
  country_id: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: "الدولة مطلوبة",
  }),
  name: createTranslatedSchema(),
  city_code: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type CityFormData = z.infer<typeof citySchema>;
export type CityFormInput = z.input<typeof citySchema>;