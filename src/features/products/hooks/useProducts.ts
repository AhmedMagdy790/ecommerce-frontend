import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { storeApi } from "@/api/client";
import { useLang } from "@/shared/context/LanguageContext";
import type { Product, ProductFilters } from "@/features/product/model/types/product.types";
import { mapProductDetails, type ProductDetails } from "@/features/product/adapters/productDetailsAdapter";

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

// استجابة المنتج الواحد بناءً على نظام الـ API لديك
export interface SingleProductApiResponse {
  status: string;
  message: string;
  data: Product<string>;
}

export interface ProductsQueryResult {
  items: Product<string>[];
  pagination: PaginationMeta;
}

export const useProducts = (params?: ProductFilters) => {
  const { lang } = useLang();

  return useQuery<ProductsApiResponse, Error, ProductsQueryResult>({
    queryKey: [
      "products", 
      params?.category_id, 
      params?.brand_id, 
      params?.brand, 
      params?.min_price, 
      params?.max_price, 
      params?.search, 
      params?.sort, 
      params?.order, 
      params?.page, 
      params?.limit, 
      lang
    ],
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
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductBySlug = (slug: string, enabled = true) => {
  const { lang } = useLang();

  return useQuery<SingleProductApiResponse, Error, ProductDetails>({
    queryKey: ["product", slug, lang],
    queryFn: async () => {
      return await storeApi.getProductById<SingleProductApiResponse>(slug);
    },
    select: (response) => mapProductDetails(response.data),
    enabled: Boolean(slug) && enabled,
    staleTime: 1000 * 60 * 5,
  });
};