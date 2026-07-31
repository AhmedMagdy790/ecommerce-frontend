import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { type IOrder, type IOrderPayload } from "../types/types";

const { orders: adminOrders } = API_ENDPOINTS.admin;
const { orders: publicOrders } = API_ENDPOINTS;

const unwrap = (response: any) => response.data?.data ?? response.data ?? response;

const orderService = {
  // --- 🌐 Public (Client Side) ---
  getMyOrders: async (): Promise<IOrder[]> => {
    return unwrap(await axiosInstance.get(publicOrders.myOrders));
  },

  create: async (payload: IOrderPayload): Promise<IOrder> => {
    return unwrap(await axiosInstance.post(publicOrders.create, payload));
  },

  cancelOrder: async (id: number | string): Promise<void> => {
    await axiosInstance.post(publicOrders.cancel(id));
  },

  // --- 🔑 Admin (Dashboard Side) ---
  getAllAdmin: async (params?: any): Promise<IOrder[]> => {
    const { data } = await axiosInstance.get(adminOrders.list, { params });
    return data.data || data;
  },

  getById: async (id: number | string): Promise<IOrder> => {
    return unwrap(await axiosInstance.get(adminOrders.details(id)));
  },

  getTrashed: async (): Promise<IOrder[]> => {
    // بناءً على الـ route:list: api/v1/admin/orders/trashed
    return unwrap(await axiosInstance.get(`${adminOrders.list}/trashed`));
  },

  update: async (id: number | string, payload: Partial<IOrderPayload>): Promise<IOrder> => {
    return unwrap(await axiosInstance.put(adminOrders.details(id), payload));
  },

  remove: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(adminOrders.details(id));
  },

  updateStatus: async (id: number | string, status: string): Promise<IOrder> => {
    return unwrap(await axiosInstance.patch(adminOrders.updateStatus(id), { status }));
  },

  restore: async (id: number | string): Promise<IOrder> => {
    // بناءً على الـ route:list: api/v1/admin/orders/{id}/restore
    return unwrap(await axiosInstance.post(`/admin/orders/${id}/restore`));
  },

  forceDelete: async (id: number | string): Promise<void> => {
    // بناءً على الـ route:list: api/v1/admin/orders/{id}/force
    await axiosInstance.delete(`/admin/orders/${id}/force`);
  }
};

export default orderService;