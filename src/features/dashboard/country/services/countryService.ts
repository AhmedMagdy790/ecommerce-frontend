import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { type ICountry } from '../types';
import { adminApi } from "@/api/client";
import { unwrapResponse } from "@/shared/utils/helper";


  // getCountries: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.countries.index)),
  // createCountry: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.countries.store, data)),
  // updateCountry: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.countries.update(id), data)),
  // deleteCountry: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.countries.destroy(id))),
  // toggleCountry: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.countries.toggle(id))),



export const countryService = {


  getAllForAdmin: async (params?: Record<string, any>): Promise<{ items: ICountry[]; pagination: any }> => {
    return adminApi.getCountries(params);
  },

  store: async (data: ICountry): Promise<ICountry> => {
    const { data: response } = await axiosInstance.post(API_ENDPOINTS.admin.countries.store, data);
    return response.data;
  },

  update: async (id: number | string, data: Partial<ICountry>): Promise<ICountry> => {
    const { data: response } = await axiosInstance.patch(API_ENDPOINTS.admin.countries.update(id), data);
    return response.data;
  },

  toggleActive: async (id: number | string): Promise<ICountry> => {
    const { data: response } = await axiosInstance.patch(API_ENDPOINTS.admin.countries.toggle(id));
    return response.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.admin.countries.destroy(id));
  }
};