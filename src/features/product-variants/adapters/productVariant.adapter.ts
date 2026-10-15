// src/features/product/adapters/productVariant.adapter.ts

import type { PaginationMeta } from "@/shared/types/api.types";
import type { ProductVariant } from "../model/types/productVariant.types";
import type { ProductVariantListResponse, ProductVariantSingleResponse } from "../model/types/productVariant.api";

export const productVariantAdapter = {
  fromListResponse(response: ProductVariantListResponse): ProductVariant[] {
    return response.data.items;
  },

  fromSingleResponse(response: ProductVariantSingleResponse): ProductVariant {
    return response.data.productVariant;
  },

  fromCreateResponse(response: ProductVariantSingleResponse): ProductVariant {
    return response.data.productVariant;
  },

  fromUpdateResponse(response: ProductVariantSingleResponse): ProductVariant {
    return response.data.productVariant;
  },

  fromToggleResponse(response: ProductVariantSingleResponse): ProductVariant {
    return response.data.productVariant;
  },

  // 🟢 Explicitly type the argument as ProductVariantListResponse to match the store generic signature
  extractPagination(response: ProductVariantListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },
};