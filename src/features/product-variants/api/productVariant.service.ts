import { adminApi } from "@/api/client";

import type { 
  PaginatedApiResponse, 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import type { ProductVariant, ProductVariantFilters } from "../model/types/productVariant.types";

export const productVariantServices = {

  getAll(params?: ProductVariantFilters) {
    return adminApi.getVariants<PaginatedApiResponse<ProductVariant>>(params);
  },

  getTrashed(params?: ProductVariantFilters) {
    return adminApi.getTrashedVariants<PaginatedApiResponse<ProductVariant>>(params);
  },

  getById(id: number | string) {
    return adminApi.getVariantById<SuccessApiResponse<{ productVariant: ProductVariant }>>(id);
  },

  create(payload: Record<string, any>) {
    return adminApi.createVariant<SuccessApiResponse<{ productVariant: ProductVariant }>, Record<string, any>>(payload);
  },

  update(id: number | string, payload: Record<string, any>) {
    return adminApi.updateVariant<SuccessApiResponse<{ productVariant: ProductVariant }>, Record<string, any>>(id, payload);
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleVariantStatus<SuccessApiResponse<{ productVariant: ProductVariant }>>(id);
  },

  delete(id: number | string) {
    return adminApi.deleteVariant<SuccessApiResponse<null>>(id);
  },

  restore(id: number | string) {
    return adminApi.restoreVariant<SuccessApiResponse<{ productVariant: ProductVariant }>>(id);
  },

  forceDelete(id: number | string) {
    return adminApi.forceDeleteVariant<SuccessApiResponse<null>>(id);
  }
};

export default productVariantServices;