import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { IAddress, IAddressPayload } from "../types/profileTypes";

const { addresses } = API_ENDPOINTS;

const unwrap = (response: any) => response.data?.data ?? response.data ?? response;

const addressService = {
  // GET /api/v1/addresses
  getAll: async (): Promise<IAddress[]> => {
    return unwrap(await axiosInstance.get(addresses.list));
  },

  // GET /api/v1/addresses/{address}
  getById: async (id: number | string): Promise<IAddress> => {
    return unwrap(await axiosInstance.get(addresses.details(id)));
  },

  // POST /api/v1/addresses
  create: async (payload: IAddressPayload): Promise<IAddress> => {
    return unwrap(await axiosInstance.post(addresses.list, payload));
  },

  // PUT /api/v1/addresses/{address}
  update: async (id: number | string, payload: Partial<IAddressPayload>): Promise<IAddress> => {
    return unwrap(await axiosInstance.put(addresses.details(id), payload));
  },

  // DELETE /api/v1/addresses/{address}
  remove: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(addresses.details(id));
  },

  // POST /api/v1/addresses/{address}/default
  setDefault: async (id: number | string): Promise<IAddress> => {
    return unwrap(await axiosInstance.post(addresses.setDefault(id)));
  }
};

export default addressService;