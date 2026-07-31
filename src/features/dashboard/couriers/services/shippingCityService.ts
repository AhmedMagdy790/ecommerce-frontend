import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints"; // تأكد من تحديث هذا الملف بالمسارات الجديدة
import { type IShippingRate } from "../types/types";

const shippingCityService = {
  /**
   * بناءً على المسار: POST api/v1/admin/shipping/cities/{cityId}/rates/{id}
   * ملاحظة: تأكد من تمرير الـ id الخاص بالتعريفة (rateId)
   */
  setRate: async (cityId: number | string, rateId: number | string, payload: any): Promise<IShippingRate> => {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.admin.shipping.updateRate(cityId, rateId), 
      payload
    );
    return data.data;
  },

  /**
   * بناءً على المسار: DELETE api/v1/admin/shipping/rates/{rate}
   */
  removeRate: async (rateId: number | string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.admin.shipping.deleteRate(rateId));
  },

  /**
   * بناءً على المسار: GET api/v1/admin/shipping/cities/{cityId}/options
   */
  getCityOptions: async (cityId: number | string): Promise<any> => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.admin.shipping.getCityOptions(cityId));
    return data.data;
  },

  /**
   * بناءً على المسار: GET api/v1/admin/shipping/rates
   */
  getAllRates: async (): Promise<IShippingRate[]> => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.admin.shipping.listRates);
    return data.data;
  }
};

export default shippingCityService;