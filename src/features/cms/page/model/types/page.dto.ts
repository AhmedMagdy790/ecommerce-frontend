// src/features/cms/page/model/types/page.dto.ts
import type { TranslatedText } from "@/shared/types/types";

export interface CreatePageDto {
  title: TranslatedText;
  slug: string;
  content?: TranslatedText | null;
  meta_title?: TranslatedText | null;
  meta_description?: TranslatedText | null;
  is_active?: boolean;
}

export type UpdatePageDto = Partial<CreatePageDto>;