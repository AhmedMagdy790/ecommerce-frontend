// src/features/product/types/product.api.ts

import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { ProductFormData } from "../schema/productSchema";
import type { Product, ProductStats } from "./product.types";
import type { TranslatedText } from "@/shared/types/types";

export type ProductListResponse =
  SuccessApiResponse<{
    items: Product<TranslatedText>[];
    pagination: PaginationMeta;
    stats: ProductStats;
  }>;
export type ProductSingleResponse = SuccessApiResponse<{ product: Product<TranslatedText> }>;
export type ProductUpdateDto = Partial<ProductFormData>;
export type ProductDeleteResponse = SuccessApiResponse<null>;

export type ProductRestoreResponse = SuccessApiResponse<Product<TranslatedText>>;