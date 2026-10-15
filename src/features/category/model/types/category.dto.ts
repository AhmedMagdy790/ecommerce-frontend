// src/features/category/model/types/category.dto.ts

import type { categorySchema } from "../schema/categorySchema";
import type { z } from "zod"; 


export type CreateCategoryDto = z.infer<typeof categorySchema>
// نوع التحديث يكون اختياري لكل الحقول
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

