import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { type ICategory, type ICategoryPayload } from "../types/types";

const categoryService = {
  // --- 🌐 القسم العام (Public) ---
  getPublicCategories: async (): Promise<ICategory[]> => {
    // API_ENDPOINTS.categories.list هو "/categories"
    const { data } = await axiosInstance.get(API_ENDPOINTS.categories.list);
    return data.data || data;
  },

  // --- 🛠️ القسم الإداري (Admin) ---
  getAllAdmin: async (): Promise<ICategory[]> => {
    // نستخدم المسار المباشر لـ Admin categories
    const { data } = await axiosInstance.get("/admin/categories");
    return data.data || data;
  },

  create: async (payload: ICategoryPayload): Promise<ICategory> => {
    const { data } = await axiosInstance.post("/admin/categories", payload, {
      headers: { 'Content-Type': "multipart/form-data" }
    });
    return data.data || data;
  },

  update: async (id: number | string, payload: Partial<ICategoryPayload>): Promise<ICategory> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });
    
    formData.append("_method", "PUT");

    // المسار المباشر للـ Update
    const { data } = await axiosInstance.post(`/admin/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.data || data;
  },

  toggleStatus: async (id: number | string): Promise<ICategory> => {
    // المسار مطابق للـ Route List: /api/v1/admin/categories/{category}/status
    const { data } = await axiosInstance.patch(`/admin/categories/${id}/status`);
    return data.data || data;
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/admin/categories/${id}`);
  },

  getTrashed: async (): Promise<ICategory[]> => {
    const { data } = await axiosInstance.get(`/admin/categories/trashed`);
    return data.data || data;
  },

  restore: async (id: number | string): Promise<ICategory> => {
    const { data } = await axiosInstance.post(`/admin/categories/${id}/restore`);
    return data.data || data;
  },

  forceDelete: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/admin/categories/${id}/force`);
  }
};

export default categoryService;