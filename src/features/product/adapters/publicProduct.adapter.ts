// src/features/product/adapters/publicProduct.adapter.ts

import type { PaginatedApiResponse, PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { Product } from "../model/types/product.types";

// نستخدم <T = TranslatedText | string> لضمان مرونة قبول النصوص سواء كانت كائنات مترجمة أو نصوصاً جاهزة
export const publicProductAdapter = {
  
  // 🟢 استخراج قائمة المنتجات للعامة
  fromListResponse(response: PaginatedApiResponse<Product<string>>): Product<string>[] {
    return response.data.items;
  },

  // 🟢 استخراج منتج مفرد (مثل صفحة تفاصيل المنتج عبر الـ slug)
  fromSingleResponse(response: SuccessApiResponse<{ product: Product<string> }>): Product<string> {
    return response.data.product;
  },

  // 🟢 استخراج معلومات الـ Pagination للمتجر (Shop page)
  extractPagination(response: PaginatedApiResponse<Product<string>>): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 12, // غالباً في المتجر تعرض 12 أو 15 منتجاً في الصفحة
      total: 0,
    };
  },
};