import { adminApi } from "@/api/client";

import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { Country, CountryFilters } from "../model/types/country.types";
import type { CountryFormData } from "../model/schema/countrySchema";
import type { CountryListResponse } from "../model/types/country.api";
import type { TranslatedText } from "@/shared/types/types";
import { serviceCache } from "@/services/cache/serviceCache";
import { createCacheKey } from "@/services/cache/createCacheKey";

const CACHE_PREFIX = "countries";
const CACHE_TTL = 24 * 60 * 60 * 1000;

const getAll = (params?: CountryFilters) => {
  const key = createCacheKey(CACHE_PREFIX, params);

  return serviceCache.getOrLoad(
    key,
    () => adminApi.getCountries<CountryListResponse>(params),
    CACHE_TTL
  );
};

export const countryService = {
  getAll,

  prefetch: getAll,

  create(payload: CountryFormData) {
    return adminApi.createCountry<
      SuccessApiResponse<{ country: Country<TranslatedText> }>,
      CountryFormData
    >(payload).then((response) => {
      serviceCache.invalidatePrefix(`${CACHE_PREFIX}:`);
      return response;
    });
  },

  update(id: number | string, payload: Partial<CountryFormData>) {
    return adminApi.updateCountry<
      SuccessApiResponse<{ country: Country<TranslatedText> }>,
      Partial<CountryFormData>
    >(id, payload).then((response) => {
      serviceCache.invalidatePrefix(`${CACHE_PREFIX}:`);
      return response;
    });
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleCountry<
      SuccessApiResponse<{ country: Country<TranslatedText> }>
    >(id).then((response) => {
      serviceCache.invalidatePrefix(`${CACHE_PREFIX}:`);
      return response;
    });
  },

  delete(id: number | string) {
    return adminApi.deleteCountry<
      SuccessApiResponse<null>
    >(id).then((response) => {
      serviceCache.invalidatePrefix(`${CACHE_PREFIX}:`);
      return response;
    });
  },
};

export default countryService;