import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { City, CityStats } from "../model/types/city.types";
import type { CityFormData } from "../model/schema/citySchema";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { CityListResponse, CitySingleResponse } from "../model/types/city.api";
import type { TranslatedText } from "@/shared/types/types";

export const cityAdapter = {
  fromListResponse(response: CityListResponse): City<TranslatedText>[] {
    return response.data.items;
  },

  fromSingleResponse(response: CitySingleResponse): City<TranslatedText> {
    return response.data.city;
  },

  fromCreateResponse(response: CitySingleResponse): City<TranslatedText> {
    return response.data.city;
  },

  fromUpdateResponse(response: CitySingleResponse): City<TranslatedText> {
    return response.data.city;
  },

  extractPagination(response: CityListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  extractStats(response: SuccessApiResponse<{
    stats: CityStats
  }>): CityStats {
    return extractStatsSafely(response?.data?.stats, {
      total: 0,
      active: 0,
      inactive: 0,
    });
  },

  fromToggleResponse: (
    response: CitySingleResponse
  ): City<TranslatedText> => {
    return response.data.city;
  },

  toCreateDto(formData: CityFormData) {
    return {
      country_id: formData.country_id,
      name: formData.name,
      city_code: formData.city_code ? formData.city_code.toUpperCase() : null,
      is_active: formData.is_active ?? true,
    };
  },

  toUpdateDto(formData: CityFormData) {
    return {
      country_id: formData.country_id,
      name: formData.name,
      city_code: formData.city_code ? formData.city_code.toUpperCase() : null,
      is_active: formData.is_active,
    };
  },
};