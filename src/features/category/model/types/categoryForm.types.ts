// src/pages/categories/model/types/category.types.ts (أو ملف الأنواع الخاص بـ Initial Data)
import type { TranslatedText } from "@/shared/types/types";
import type { CategoryStatus, Category } from "./category.types";

export type InitialCategoryData = {
  id: number;
  name: TranslatedText;
  description: TranslatedText | null;
  parent: Category<TranslatedText> | null;
  status: CategoryStatus;
  image?: string | null;
};