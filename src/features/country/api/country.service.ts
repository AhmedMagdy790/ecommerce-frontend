import { adminApi } from "@/api/client";
import type { 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import type { Country, CountryFilters } from "../model/types/country.types";
import type { CountryFormData } from "../model/schema/countrySchema";
import type { CountryListResponse } from "../model/types/country.api";
import type { TranslatedText } from "@/shared/types/types";

export const countryService = {

  getAll(params?: CountryFilters) {
    return adminApi.getCountries<CountryListResponse>(params);
  },

  create(payload: CountryFormData) {
    return adminApi.createCountry<SuccessApiResponse<{ country: Country<TranslatedText> }>, CountryFormData>(
      payload
    );
  },

  update(id: number | string, payload: Partial<CountryFormData>) {
    return adminApi.updateCountry<
      SuccessApiResponse<{ country: Country<TranslatedText> }>,
      Partial<CountryFormData>
    >(
      id,
      payload
    );
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleCountry<SuccessApiResponse<{ country: Country<TranslatedText> }>>(id);
  },

  delete(id: number | string) {
    return adminApi.deleteCountry<SuccessApiResponse<null>>(id);
  },

};

export default countryService;