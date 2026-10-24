// src/features/countries/adapters/country.adapter.ts
import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { Country, CountryStats } from "../model/types/country.types";
import type { CountryFormData } from "../model/schema/countrySchema";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { CountryListResponse } from "../model/types/country.api";
import type { TranslatedText } from "@/shared/types/types";

export const countryAdapter = {
  fromListResponse(response: CountryListResponse): Country<TranslatedText>[] {
    return response.data.items;
  },

  fromSingleResponse(response: SuccessApiResponse<{ country: Country<TranslatedText> }>): Country<TranslatedText> {
    return response.data.country;
  },

  fromCreateResponse(response: SuccessApiResponse<{ country: Country<TranslatedText> }>): Country<TranslatedText> {
    return response.data.country;
  },

  fromUpdateResponse(response: SuccessApiResponse<{ country: Country<TranslatedText> }>): Country<TranslatedText> {
    return response.data.country;
  },

  fromToggleResponse(response: SuccessApiResponse<{ country: Country<TranslatedText> }>): Country<TranslatedText> {
    console.log(response)
    return response.data.country;
  },

  extractPagination(response: CountryListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  extractStats(
    response: CountryListResponse
  ): CountryStats {
    return extractStatsSafely(
      response.data.stats,
      {
        total: 0,
        active: 0,
        inactive: 0,
        trashed: 0,
      }
    );
  },

  toCreateDto(formData: CountryFormData) {
    return {
      name: formData.name,
      code: formData.code.toUpperCase(),
      currency: formData.currency.toUpperCase(),
      phone_code: formData.phone_code,
      is_active: formData.is_active ?? true,
    };
  },

  toUpdateDto(formData: CountryFormData) {
    return {
      name: formData.name,
      code: formData.code.toUpperCase(),
      currency: formData.currency.toUpperCase(),
      phone_code: formData.phone_code,
      is_active: formData.is_active,
    };
  },
};

export default countryAdapter;