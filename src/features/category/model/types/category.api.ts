// src/features/category/model/types/category.api.ts
import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { Category, CategoryStats } from "./category.types";
import type { TranslatedText } from "@/shared/types/types";


export type CategoryListResponse = SuccessApiResponse<{
    items: Category<TranslatedText>[],
    stats: CategoryStats,
    pagination: PaginationMeta
}>;
export type CategorySingleResponse = SuccessApiResponse<{ category: Category<TranslatedText> }>;
export type CategoryDeleteResponse = SuccessApiResponse<null>;