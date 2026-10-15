// src/features/category/api/category.service.ts
import { adminApi } from "@/api/client";

import type { 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import { createFormData } from "@/shared/utils/api-helpers";
import type { CreateCategoryDto, UpdateCategoryDto } from "../model/types/category.dto";
import type { CategoryListResponse, CategorySingleResponse } from "../model/types/category.api";
import type { CategoryFilters } from "../model/types/category.types";

export const categoryServices = {

  getAll(params?: CategoryFilters) {
    return adminApi.getCategories<CategoryListResponse>(params);
  },

  getTrashed(params?: CategoryFilters) {
    return adminApi.getTrashedCategories<CategoryListResponse>(params);
  },

  getCategoryById(id: number | string) {
    return adminApi.getCategoryById<CategorySingleResponse>(id);
  },

  create(payload: CreateCategoryDto) {
    return adminApi.createCategory<CategorySingleResponse, FormData>(
      createFormData(payload)
    );
  },

  update(id: number | string, payload: UpdateCategoryDto) {

    const formData = createFormData(payload);
    formData.append("_method", "PUT");

    return adminApi.patchCategory<
      CategorySingleResponse,
      FormData
    >(
      id,
      formData
    );
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleCategoryStatus<CategorySingleResponse>(id);
  },

  delete(id: number | string) {
    return adminApi.deleteCategory<SuccessApiResponse<null>>(id);
  },

  restore(id: number | string) {
    return adminApi.restoreCategory<CategorySingleResponse>(id);
  },

  forceDelete(id: number | string) {
    console.log("Here..")
    return adminApi.forceDeleteCategory<SuccessApiResponse<null>>(id);
  }
};

export default categoryServices;