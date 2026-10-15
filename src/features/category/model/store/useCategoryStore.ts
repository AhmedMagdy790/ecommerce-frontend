// src/features/categories/store/category.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";
import categoryServices from "../../api/category.service";
import { categoryAdapter } from "../../adapters/category.adapter";
import type { TranslatedText } from "@/shared/types/types";
import {
  CATEGORY_STATUS,
  type Category,
  type CategoryFilters,
  type CategoryStatus,
} from "../types/category.types";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/category.dto";
import type {
  CategoryDeleteResponse,
  CategoryListResponse,
  CategorySingleResponse,
} from "../types/category.api";
import { DEFAULT_CATEGORY_FILTERS } from "../../constants/category.constants";
import { categoryStatsHooks, categoryStatsStore } from "./categoryStatsHooks";


export const useCategoryStore = createFeatureStore<
  Category<TranslatedText>,                // 1. TModel
  CreateCategoryDto,                       // 2. TCreateDto
  UpdateCategoryDto,                       // 3. TUpdateDto
  CategoryFilters,                         // 4. TFilters
  CategoryListResponse,                    // 5. TListRes
  CategorySingleResponse,                  // 6. TSingleRes
  CategoryDeleteResponse,                  // 7. TDeleteRes
  CategorySingleResponse,                  // 8. TUpdateRes
  CategoryListResponse,                    // 9. TTrashRes (استجابة getTrashed)
  CategorySingleResponse,                  // 10. TRestoreRes (استجابة restore)
  CategoryDeleteResponse,
  Record<string, never>,
  CategoryStatus
>({
  name: "CategoryStore",

  service: categoryServices,

  adapter: categoryAdapter,

  defaultFilters: DEFAULT_CATEGORY_FILTERS,

  defaultSortBy: "createdAt",

 
  hooks: {

    onFetched: (response) => {
      const stats = categoryAdapter.extractStats(response);
      categoryStatsHooks.onFetched(stats);
    },

    // تحديث إحصائيات الإنشاء مباشرة
    onCreated: categoryStatsHooks.onCreated,

    // تحديث إحصائيات الحذف (نقل للمحذوفات)
    onDeleted: categoryStatsHooks.onDeleted,
  },


  toggle: {
    extractItem:
      categoryAdapter.fromToggleResponse,

    getStatus: (item) =>
      item.status,


    getNextStatus: (currentStatus) =>
      currentStatus === CATEGORY_STATUS.ACTIVE
        ? CATEGORY_STATUS.INACTIVE
        : CATEGORY_STATUS.ACTIVE,

    setStatus: (
      item,
      status,
    ) => ({
      ...item,
      status,
    }),

    onChanged: (
      item: Category<TranslatedText>,
      previousStatus: CategoryStatus,
    ) => {
      const store = categoryStatsStore.getState();

      if (previousStatus === CATEGORY_STATUS.ACTIVE) {
        store.decrement("active");
      } else {
        store.decrement("inactive");
      }

      if (item.status === CATEGORY_STATUS.ACTIVE) {
        store.increment("active");
      } else {
        store.increment("inactive");
      }
    },


    errorMessage:
      "فشل تغيير حالة المنتج",
  },
});












