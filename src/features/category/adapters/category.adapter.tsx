// src/features/category/adapters/category.adapter.ts

import type { PaginationMeta } from "@/shared/types/api.types";
import type { Category, CategoryStats } from "../model/types/category.types";
import type { TranslatedText } from "@/shared/types/types";
import type { CategoryFormData } from "../model/schema/categorySchema";
import type { CreateCategoryDto, UpdateCategoryDto } from "../model/types/category.dto";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { CategoryListResponse, CategorySingleResponse } from "../model/types/category.api";

export const categoryAdapter = {
  fromListResponse(response: CategoryListResponse): Category<TranslatedText>[] {
    return response.data.items;
  },

  fromCreateResponse(response: CategorySingleResponse): Category<TranslatedText> {
    return response.data.category;
  },

  fromUpdateResponse(response: CategorySingleResponse): Category<TranslatedText> {
    return response.data.category;
  },

  fromToggleResponse(response: CategorySingleResponse): Category<TranslatedText> {
    return response.data.category;
  },

  extractPagination(response: CategoryListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  extractStats(response: CategoryListResponse): CategoryStats {
    return extractStatsSafely(response.data.stats, {
      total: 0,
      active: 0,
      inactive: 0,
    });
  },

  toCreateDto(formData: CategoryFormData): CreateCategoryDto {
    return {
      name: formData.name,
      description: formData.description,
      parent_id: formData.parent_id || null,
      status: formData.status ?? "active",
      ...(formData.image ? { image: formData.image } : {}),
    };
  },

  toUpdateDto(formData: CategoryFormData): UpdateCategoryDto {
    return {
      name: formData.name,
      description: formData.description,
      parent_id: formData.parent_id,
      status: formData.status,
      ...(formData.image ? { image: formData.image } : {}),
    };
  }
};