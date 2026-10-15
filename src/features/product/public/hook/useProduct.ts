// src/features/product/hook/useProduct.ts

import { storeApi } from "@/api/client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { publicProductAdapter } from "../../adapters/publicProduct.adapter";
import type { Product } from "../../model/types/product.types";

export function useProduct(slug: string): UseQueryResult<Product<string>, Error> {
  return useQuery({
    queryKey: ["product", slug],

    queryFn: async () => {
      const response = await storeApi.getProductById(slug);
      return publicProductAdapter.fromSingleResponse(response);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}