// src/features/product/hooks/useProduct.ts

import { useQuery } from "@tanstack/react-query";
import productService from "../services/productService";

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ["product", slug],

    queryFn: () => productService.getBySlug(slug!),

    enabled: !!slug,

    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
}