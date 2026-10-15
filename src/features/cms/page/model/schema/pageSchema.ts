import { z } from "zod";
import { createTranslatedSchema } from "@/shared/utils/schemas";

export const pageSchema = z.object({
  title: createTranslatedSchema(
    true,
    "عنوان الصفحة مطلوب باللغة الأساسية"
  ),

  slug: z
    .string()
    .min(1, "معرّف الصفحة مطلوب")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "يجب أن يكون المعرّف باللغة الإنجليزية وبصيغة صحيحة"
    ),

  content: createTranslatedSchema(false),

  meta_title: createTranslatedSchema(false),

  meta_description: createTranslatedSchema(false),

  is_active: z.boolean().default(true),
});

export type PageFormData = z.infer<typeof pageSchema>;

export type PageFormInput = z.input<typeof pageSchema>;