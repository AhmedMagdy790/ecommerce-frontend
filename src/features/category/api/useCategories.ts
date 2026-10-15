import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/api/client";
import type { Category } from "../model/types/category.types";

interface CategoriesResponse {
  data: Category<string>[];
}

/**
 * Hook لجلب قائمة الأقسام (Categories)
 */
export const useCategories = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const response = await storeApi.getCategories<CategoriesResponse>(params);
      return response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 دقيقة للأقسام لكونها نادرة التغير
  });
};

/**
 * Hook لجلب تفاصيل قسم محدد برقمه المعرف ID
 */
export const useCategoryById = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await storeApi.getCategoryById<{ data: Category<string> }>(id);
      return response.data;
    },
    enabled: Boolean(id) && enabled,
  });
};