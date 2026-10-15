import { createTranslatedSchema } from "@/shared/utils/schemas";
import { z } from "zod";
import { SectionTypes } from "../types/section.types";

export const sectionSchema = z.object({
  page_id: z.number().int().positive("Page ID is required"),

  name: createTranslatedSchema(true, "Name is required"),

  key: z.string().min(1, "Key is required"),

  type: z.enum(SectionTypes, {
    error: "Please select a valid section type",
  }),

  sort_order: z.number().int().default(0),

  is_active: z.boolean().default(true),

  settings: z.record(z.string(), z.unknown()).nullable().optional(),

  selected_ids: z
    .array(z.number().int().positive("Invalid Selects ID"))
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Duplicate products are not allowed",
    )
    .optional(),
});

export type SectionFormData = z.infer<typeof sectionSchema>;
export type SectionFormInput = z.input<typeof sectionSchema>;
