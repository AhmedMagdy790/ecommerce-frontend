import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiProduct, ApiProductsResponse, ProductFilters } from "../types/api";

const { products: publicProducts } = API_ENDPOINTS;

const unwrap = (response: any) => response.data?.data ?? response.data ?? response;


export interface ProductDetailsResponse {
  product: ApiProduct;
}

const productService = {
    // --- 🌐 Public ---
    getPublicProducts: async (
    params?: ProductFilters
    ): Promise<ApiProductsResponse> => {
    const { data } = await axiosInstance.get(publicProducts.list, {
        params,
    });

    return data.data || data;
    },

    getBySlug: async (
    slug: string
    ): Promise<ProductDetailsResponse> => {

    return unwrap(
        await axiosInstance.get(
        publicProducts.bySlug(slug)
        )
    );

    },

};

export default productService;