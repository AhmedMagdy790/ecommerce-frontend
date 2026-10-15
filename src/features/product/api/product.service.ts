import { adminApi } from "@/api/client";

import type {
  SuccessApiResponse,
} from "@/shared/types/api.types";

import { createFormData } from "@/shared/utils/api-helpers";

import type {
  Product,
  ProductFilters,
} from "../model/types/product.types";

import type {
  CreateProductDto,
  UpdateProductDto,
} from "../model/types/product.dto";

import type { TranslatedText } from "@/shared/types/types";

import type {
  ProductListResponse,
} from "../model/types/product.api";

export const productServices = {
  getAll(params?: ProductFilters) {
    return adminApi.getProducts<ProductListResponse>(params);
  },

  getTrashed(params?: ProductFilters) {
    return adminApi.getTrashedProducts<ProductListResponse>(params);
  },

  create(payload: CreateProductDto) {
    return adminApi.createProduct<
      SuccessApiResponse<{
        product: Product<TranslatedText>;
      }>,
      FormData
    >(
      createFormData(payload)
    );
  },

  update(
    id: number | string,
    payload: UpdateProductDto
  ) {
    const formData = createFormData(payload);

    formData.append("_method", "PUT");

    return adminApi.updateProduct<
      SuccessApiResponse<{
        product: Product<TranslatedText>;
      }>,
      FormData
    >(
      id,
      formData
    );
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleProductStatus<
      SuccessApiResponse<{
        product: Product<TranslatedText>;
      }>
    >(id);
  },

  delete(id: number | string) {
    return adminApi.deleteProduct<
      SuccessApiResponse<null>
    >(id);
  },

  restore(id: number | string) {
    return adminApi.restoreProduct<
      SuccessApiResponse<Product<TranslatedText>>
    >(id);
  },

  forceDelete(id: number | string) {
    return adminApi.forceDeleteProduct<
      SuccessApiResponse<null>
    >(id);
  },
};

export default productServices;