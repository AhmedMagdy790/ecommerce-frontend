import { storeApi } from "@/api/client";
import type { 
  PaginatedApiResponse, 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import type { Address, AddressFilters } from "../model/types/address.types";
import type { CreateAddressDto, UpdateAddressDto } from "../model/types/address.dto";

export const addressServices = {

  getAll(params?: AddressFilters) {
    return storeApi.getAddresses<PaginatedApiResponse<Address>>(params);
  },

  getAddressById(id: number | string) {
    return storeApi.getAddressById<SuccessApiResponse<{ address: Address }>>(id);
  },

  create(payload: CreateAddressDto) {
    return storeApi.createAddress<SuccessApiResponse<{ address: Address }>, CreateAddressDto>(payload);
  },

  update(id: number | string, payload: UpdateAddressDto) {
    return storeApi.updateAddress<SuccessApiResponse<{ address: Address }>, UpdateAddressDto>(id, payload);
  },

  setDefault(id: number | string) {
    return storeApi.setDefaultAddress<SuccessApiResponse<{ address: Address }>>(id);
  },

  delete(id: number | string) {
    return storeApi.deleteAddress<SuccessApiResponse<null>>(id);
  },

};

export default addressServices;