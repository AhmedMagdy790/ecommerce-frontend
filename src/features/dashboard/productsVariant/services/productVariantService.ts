import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { type ProductVariantFormData } from "../schema/productVariantSchema";
import { type IProductVariant } from "../types/types";

const { variants } = API_ENDPOINTS.admin;

const unwrap = (response: any) => response.data?.data ?? response.data ?? response;

const productVariantService = {
  // GET /api/v1/admin/variants
  getAllVariantsAdmin: async (params?: any): Promise<IProductVariant[]> => {
    const { data } = await axiosInstance.get(variants.list, { params });
    return data.data || data;
  },

  // GET /api/v1/admin/variants/{variant}
  getById: async (variantId: number | string): Promise<IProductVariant> => {
    return unwrap(await axiosInstance.get(variants.details(variantId)));
  },

  // POST /api/v1/admin/variants
  create: async (payload: ProductVariantFormData): Promise<IProductVariant> => {
    return unwrap(await axiosInstance.post(variants.list, payload));
  },

  // PUT /api/v1/admin/variants/{variant}
  update: async (
    variantId: number | string,
    payload: Partial<ProductVariantFormData>
  ): Promise<IProductVariant> => {
    return unwrap(await axiosInstance.put(variants.details(variantId), payload));
  },

  // PATCH /api/v1/admin/variants/{variant}/stock
  updateStock: async (
    variantId: number | string,
    stock: number
  ): Promise<IProductVariant> => {
    return unwrap(await axiosInstance.patch(variants.updateStock(variantId), { stock }));
  },

  // DELETE /api/v1/admin/variants/{variant}
  remove: async (variantId: number | string): Promise<void> => {
    await axiosInstance.delete(variants.details(variantId));
  },

  // POST /api/v1/admin/variants/{id}/restore
  restore: async (variantId: number | string): Promise<IProductVariant> => {
    return unwrap(await axiosInstance.post(variants.restore(variantId)));
  },

  // DELETE /api/v1/admin/variants/{id}/force
  forceDelete: async (variantId: number | string): Promise<void> => {
    await axiosInstance.delete(variants.force(variantId));
  },
};

export default productVariantService;