import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  description: z.string().optional().nullable(),
  parent_id: z.number().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
  image: z.any().nullable().optional(),

});

export type CategoryFormData = z.infer<typeof categorySchema>;