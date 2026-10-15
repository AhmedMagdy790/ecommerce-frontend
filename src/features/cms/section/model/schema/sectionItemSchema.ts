import { z } from "zod";
import { createTranslatedSchema } from "@/shared/utils/schemas";

export const sectionItemSchema = z.object({
  section_id: z.number().int().positive("Section ID is required"),
  
  product_id: z.number().int().positive().nullable().optional(),

  title: createTranslatedSchema(false),
  subtitle: createTranslatedSchema(false).nullable().optional(),
  description: createTranslatedSchema(false).nullable().optional(),

  // Example adjustment if relative paths are allowed:
  image: z.string().nullable().optional().or(z.literal("")),
  link: z.string().nullable().optional().or(z.literal("")),

  button_text: createTranslatedSchema(false).nullable().optional(),
  action_text: createTranslatedSchema(false).nullable().optional(),

  float_title: createTranslatedSchema(false).nullable().optional(),
  float_subtitle: createTranslatedSchema(false).nullable().optional(),
  stat_number: createTranslatedSchema(false).nullable().optional(),
  stat_text: createTranslatedSchema(false).nullable().optional(),

  data: z.union([
    z.record(z.string(), z.unknown()), // في حال كان كائن (Object)
    z.array(z.unknown()),             // في حال كان مصفوفة (Array)
  ]).nullable().optional(),

  sort_order: z.number().int().default(0),
});

export type SectionItemFormData = z.infer<typeof sectionItemSchema>;
export type SectionItemFormInput = z.input<typeof sectionItemSchema>;