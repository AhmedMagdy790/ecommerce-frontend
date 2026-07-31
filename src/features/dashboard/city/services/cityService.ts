// src/api/services/cityService.ts (أو أينما تضع ملفات الـ services)
import axiosInstance from "@/api/axios-instance"; // المسار الجديد الموحد
import { API_ENDPOINTS } from "@/api/endpoints"; // الاستيراد من ملف الـ Endpoints
import { type ICity } from '../types';

export const cityService = {

  // جلب كل المدن حسب الدولة (استخدام endpoints.geo)
  getByCountry: async (country_id: string | number): Promise<ICity[]> => {
    const { data: response } = await axiosInstance.get(API_ENDPOINTS.geo.cities(country_id));
    return response.data; 
  },

  // إضافة مدينة جديدة (Admin Route)
  store: async (data: Partial<ICity>): Promise<ICity> => {
    // بالرجوع للـ Route List الخاص بك: api/v1/admin/cities
    const { data: response } = await axiosInstance.post("/admin/cities", data);
    return response.data;
  },

  // جلب خيارات الشحن (استخدام endpoints.geo)
  shippingOptions: async (cityId: number | string): Promise<any[]> => {
    const { data: response } = await axiosInstance.get(API_ENDPOINTS.geo.shippingOptions(cityId));
    return response.data;
  },

  // تحديث بيانات مدينة
  update: async (id: number | string, data: Partial<ICity>): Promise<ICity> => {
    const { data: response } = await axiosInstance.patch(`/admin/cities/${id}`, data);
    return response.data;
  },

  // تغيير حالة التفعيل
  toggleActive: async (id: number | string): Promise<ICity> => {
    const { data: response } = await axiosInstance.patch(`/admin/cities/${id}/toggle`);
    return response.data;
  },

  // حذف مدينة
  delete: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/admin/cities/${id}`);
  },

  // إضافة سعر شحن (Admin Route)
  addShippingRate: async (cityId: number, shippingData: any) => {
    const { data: response } = await axiosInstance.post(`/admin/cities/${cityId}/shipping-rates/set`, shippingData);
    return response.data;
  }
};