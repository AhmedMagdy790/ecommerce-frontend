import type { PaginatedApiResponse, SuccessApiResponse } from "@/shared/types/api.types";
import type { Address } from "../model/types/address.types";
import type { AddressFormData } from "../model/schema/addressSchema";
import type { CreateAddressDto, UpdateAddressDto } from "../model/types/address.dto";

export const addressAdapter = {
  fromListResponse(response: PaginatedApiResponse<Address>): Address[] {
    return response.data.items;
  },

  fromSingleResponse(response: SuccessApiResponse<{ address: Address }>): Address {
    return response.data.address;
  },

  fromCreateResponse(response: SuccessApiResponse<{ address: Address }>): Address {
    return response.data.address;
  },

  fromUpdateResponse(response: SuccessApiResponse<{ address: Address }>): Address {
    return response.data.address;
  },

  extractPagination(response: PaginatedApiResponse<Address>) {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  toCreateDto(formData: AddressFormData): CreateAddressDto {
    return {
      country_id: formData.country_id,
      city_id: formData.city_id,
      type: formData.type || "home",
      street_details: formData.street_details,
      area: formData.area || null,
      building_number: formData.building_number || null,
      phone_contact: formData.phone_contact || null,
      is_default: formData.is_default ?? false,
    };
  },

  toUpdateDto(formData: AddressFormData): UpdateAddressDto {
    return {
      country_id: formData.country_id,
      city_id: formData.city_id,
      type: formData.type,
      street_details: formData.street_details,
      area: formData.area || null,
      building_number: formData.building_number || null,
      phone_contact: formData.phone_contact || null,
      is_default: formData.is_default,
    };
  }
};