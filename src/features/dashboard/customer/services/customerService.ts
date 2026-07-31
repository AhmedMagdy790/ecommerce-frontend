import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
// import {  type ICustomerPayload } from "../types/types";
import type { IUser } from "@/shared/types/userType";
import type { CustomerInput } from "../schema/customerSchema";

const { customers } = API_ENDPOINTS.admin;

const customerService = {
  // GET /api/v1/admin/customers
  getAll: async (filters?: any): Promise<{ data: IUser[], meta?: any }> => {
    const { data } = await axiosInstance.get(customers.list, {
      params: filters,
    });
    // هنا نرجع الـ data كاملة لأن الـ API عادةً يعيدها مع meta للـ pagination
    return data;
  },

  // GET /api/v1/admin/customers/{customer}
  getById: async (id: number | string): Promise<IUser> => {
    const { data } = await axiosInstance.get(customers.details(id));
    return data.data;
  },

  // POST /api/v1/admin/customers
  create: async (payload: CustomerInput): Promise<IUser> => {
    const { data } = await axiosInstance.post(customers.list, payload);
    return data.data;
  },

  // PUT /api/v1/admin/customers/{customer}
  update: async (id: number | string, payload: Partial<CustomerInput>): Promise<IUser> => {
    const { data } = await axiosInstance.put(customers.details(id), payload);
    return data.data;
  },

  // DELETE /api/v1/admin/customers/{customer}
  remove: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(customers.details(id));
  },

  // البحث غالباً ما يكون هو نفس مسار الـ getAll مع تمرير params
  search: async (term: string): Promise<IUser[]> => {
    const { data } = await axiosInstance.get(customers.list, {
      params: { search: term },
    });
    // تأكد من هيكل البيانات المرجعة (هل هي data.data أم data.data.items)
    return data.data;
  }
};

export default customerService;