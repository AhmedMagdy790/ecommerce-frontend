import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { adminApi } from "@/api/client";

import type {
  ApiAdminProduct,
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilters,
  ProductListResponse,
} from "../types";

const unwrap = <T>(response: any): T =>
  response.data?.data ?? response.data ?? response;

const appendToFormData = (
  formData: FormData,
  data: any,
  parentKey?: string
) => {
  if (data instanceof File) {
    formData.append(parentKey!, data);
  } else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      appendToFormData(formData, item, `${parentKey}[${index}]`);
    });
  } else if (typeof data === "object" && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      appendToFormData(
        formData,
        value,
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else if (data !== null && data !== undefined) {
    formData.append(parentKey!, String(data));
  }
};

const adminProductService = {
  getAll(params?: ProductFilters): Promise<ProductListResponse> {
    return adminApi.getProducts<ProductListResponse>().then(unwrap<ProductListResponse>);
  },

  getTrashed(params?: ProductFilters): Promise<ProductListResponse> {
    return adminApi.getTrashedProducts<ProductListResponse>().then(unwrap<ProductListResponse>);
  },

  create(payload: CreateProductPayload): Promise<ApiAdminProduct> {
    const formData = new FormData();
    appendToFormData(formData, payload);

    return axiosInstance
      .post(API_ENDPOINTS.admin.products.store, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(unwrap<ApiAdminProduct>);
  },

  update(
    id: number | string,
    payload: UpdateProductPayload
  ): Promise<ApiAdminProduct> {
    const formData = new FormData();
    appendToFormData(formData, payload);

    return axiosInstance
      .post(API_ENDPOINTS.admin.products.update(id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          _method: "PUT",
        },
      })
      .then(unwrap<ApiAdminProduct>);
  },

  toggleStatus(id: number | string): Promise<ApiAdminProduct> {
    return adminApi.toggleProductStatus<ApiAdminProduct>(id).then(unwrap<ApiAdminProduct>);
  },
  
  remove(id: number | string): Promise<ApiAdminProduct> {
    return adminApi.deleteProduct<ApiAdminProduct>(id).then(unwrap);
  },

  restore(id: number | string): Promise<ApiAdminProduct> {
    return adminApi.restoreProduct<ApiAdminProduct>(id).then(unwrap<ApiAdminProduct>);
  },

  forceDelete(id: number | string): Promise<void> {
    return adminApi.forceDeleteProduct<void>(id).then(unwrap);
  },
};

export default adminProductService;