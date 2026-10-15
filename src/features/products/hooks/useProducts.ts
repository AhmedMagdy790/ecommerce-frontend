import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { storeApi } from "@/api/client";
import { useLang } from "@/shared/context/LanguageContext";
import type { Product, ProductFilters } from "@/features/product/model/types/product.types";

export interface PaginationMeta {
  type: string;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductsApiResponse {
  status: string;
  message: string;
  data: {
    items: Product<string>[];
    pagination: PaginationMeta;
    stats?: Record<string, unknown>[];
  };
}

export interface ProductsQueryResult {
  items: Product<string>[];
  pagination: PaginationMeta;
}

/**
 * Hook لجلب قائمة المنتجات متوافق تماماً مع الاستجابة الحالية من الـ API
 */
export const useProducts = (params?: ProductFilters) => {
  const { lang } = useLang();


  return useQuery<ProductsApiResponse, Error, ProductsQueryResult>({
    queryKey: ["products", params, lang],
    queryFn: async () => {
      return await storeApi.getProducts<ProductsApiResponse>(params);
    },
    select: (response): ProductsQueryResult => {
      const payload = response?.data;


      return {
        items: payload?.items ?? [],
        pagination: payload?.pagination ?? {
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: 0,
          type: "server",
        },
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
};

/**
 * Hook لجلب تفاصيل منتج واحد باستخدام الـ slug
 */
export const useProductBySlug = (slug: string, enabled = true) => {
  const { lang } = useLang();

  return useQuery<{ data: Product<string> }, Error, Product<string>>({
    queryKey: ["product", slug, lang],
    queryFn: async () => {
      return await storeApi.getProductById<{ data: Product<string> }>(slug);
    },
    select: (response) => response.data,
    enabled: Boolean(slug) && enabled,
    staleTime: 1000 * 60 * 5,
  });
};