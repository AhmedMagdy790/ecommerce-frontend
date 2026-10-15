// src/features/product/adapters/product.adapter.ts

import type { PaginatedApiResponse, PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { Product, ProductStats } from "../model/types/product.types";
import type { TranslatedText } from "@/shared/types/types";
import type { ProductListResponse } from "../model/types/product.api";

export const productAdapter = {
  fromListResponse(response: PaginatedApiResponse<Product<TranslatedText>>): Product<TranslatedText>[] {
    return response.data.items;
  },

  fromSingleResponse(response: SuccessApiResponse<{ product: Product<TranslatedText> }>): Product<TranslatedText> {
    return response.data.product;
  },

  fromCreateResponse(response: SuccessApiResponse<{ product: Product<TranslatedText> }>): Product<TranslatedText> {
    return response.data.product;
  },

  // 🟢 أضفنا هذه الدالة لأنها مطلوبة في الـ feature store للـ update
  fromUpdateResponse(response: SuccessApiResponse<{ product: Product<TranslatedText> }>): Product<TranslatedText> {
    return response.data.product;
  },

  fromToggleResponse(response: SuccessApiResponse<{ product: Product<TranslatedText> }>): Product<TranslatedText> {
    return response.data.product;
  },

  extractStats(
    response: ProductListResponse
  ): ProductStats {
    return (
      response.data.stats ?? {
        total: 0,
        active: 0,
        draft: 0,
        archived: 0,
        trashed: 0,
      }
    );
  },

  extractPagination(response: PaginatedApiResponse<Product<TranslatedText>>): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },
};