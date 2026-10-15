// src/features/category/model/schema/categorySchema.ts
import { z } from "zod";
import { createTranslatedSchema } from "@/shared/utils/schemas";

export const categorySchema = z.object({
  name: createTranslatedSchema(
    true,
    "اسم التصنيف مطلوب باللغة الأساسية"
  ),

  description: createTranslatedSchema(false),

  parent_id: z
    .union([
      z.number().int(),
      z.string().regex(/^\d+$/, "يجب أن يكون رقمًا صحيحًا"),
    ])
    .nullable()
    .optional()
    .transform((value) => {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      return Number(value);
    }),

  status: z
    .enum(["active", "inactive"])
    .default("active"),

  image: z
    .union([
        z.string(),
        z.instanceof(File),
    ])
    .nullable()
    .optional(),
});

export type CategoryFormData =
  z.infer<typeof categorySchema>;

export type CategoryFormInput =
  z.input<typeof categorySchema>;
