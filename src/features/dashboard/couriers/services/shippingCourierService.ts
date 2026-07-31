import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  type IShippingCourier,
  type IShippingCourierPayload,
} from "../types/types";

// استبدلنا ADMIN_URL المباشر بـ API_ENDPOINTS لضمان المركزية
const { couriers } = API_ENDPOINTS.admin;

const unwrap = (response: any) => response.data;

const shippingCourierService = {
  getAll: async (params?: any) => {
    return unwrap( await axiosInstance.get(couriers.list, { params }));
  },

  getById: async (id: number | string): Promise<IShippingCourier> => {
    return unwrap(await axiosInstance.get(couriers.details(id)));
  },

  create: async (payload: IShippingCourierPayload): Promise<IShippingCourier> => {
    return unwrap(await axiosInstance.post(couriers.list, payload));
  },

  update: async (id: number | string, payload: Partial<IShippingCourierPayload>): Promise<IShippingCourier> => {
    return unwrap(await axiosInstance.put(couriers.update(id), payload));
  },

  toggleStatus: async (id: number | string): Promise<IShippingCourier> => {
    return unwrap(await axiosInstance.patch(couriers.toggle(id)));
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(couriers.destroy(id));
  },

  getTrashed: async (params?: any) => {
    return unwrap(await axiosInstance.get(couriers.trashed, { params }));
  },

  restore: async (id: number | string): Promise<IShippingCourier> => {
    return unwrap(await axiosInstance.post(couriers.restore(id)));
  },

  forceDelete: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(couriers.force(id));
  },
};

export default shippingCourierService;