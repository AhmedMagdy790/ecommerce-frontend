import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { type IShippingRate } from "../types/types";

export interface IFetchRatesParams {
  page?: number;
  city_id?: number;
  courier_id?: number;
  is_active?: boolean;
  search?: string;
}

const unwrap = (response: any) => response.data?.data ?? response.data ?? response;

const shippingRateService = {
  // GET /api/v1/admin/shipping/rates
  getAll: async (params?: IFetchRatesParams) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.admin.shipping.listRates, { params });
    return data;
  },

  // PUT /api/v1/admin/shipping/cities/{cityId}/rates/{id}
  setRate: async (cityId: number | string, rateId: number | string, payload: any): Promise<IShippingRate> => {
    return unwrap(await axiosInstance.put(API_ENDPOINTS.admin.shipping.updateRate(cityId, rateId), payload));
  },

  create: async (cityId: number | string, payload: any): Promise<IShippingRate> => {
    return unwrap(await axiosInstance.post(`/admin/shipping/cities/${cityId}/rates`, payload));
  },

  // PATCH /api/v1/admin/shipping/rates/{id}/status
  toggleStatus: async (id: number | string): Promise<IShippingRate> => {
    return unwrap(await axiosInstance.patch(API_ENDPOINTS.admin.shipping.toggleRateStatus(id)));
  },

  // DELETE /api/v1/admin/shipping/rates/{rateId}
  remove: async (rateId: number | string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.admin.shipping.deleteRate(rateId));
  },

  // GET /api/v1/admin/shipping/cities/{cityId}/options
  getOptions: async (
    cityId: number | string, 
    params: { weight: number; subtotal: number; payment_method: string }
  ) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.admin.shipping.getCityOptions(cityId), { params });
    return data;
  },
};

export default shippingRateService;