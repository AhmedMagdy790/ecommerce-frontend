import { adminApi } from "@/api/client";
import type { 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import type { City, CityFilters } from "../model/types/city.types";
import type { CityFormData } from "../model/schema/citySchema";
import type { CityListResponse, CitySingleResponse } from "../model/types/city.api";
import type { TranslatedText } from "@/shared/types/types";

export const cityService = {

  getAll(params?: CityFilters) {

    return adminApi.getCities<CityListResponse>(params);
  },

  getByCountryList(countryId: number | string) {
    return adminApi.getCitiesListByCountry<{ data: City<TranslatedText>[]}>(countryId);
  },

  create(payload: CityFormData) {
    return adminApi.createCity<CitySingleResponse, CityFormData>(
      payload
    );
  },

  update(id: number | string, payload: Partial<CityFormData>) {
    return adminApi.updateCity<
      CitySingleResponse,
      Partial<CityFormData>
    >(
      id,
      payload
    );
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleCity<CitySingleResponse>(id);
  },

  delete(id: number | string) {
    return adminApi.deleteCity<SuccessApiResponse<null>>(id);
  },

  // أسعار الشحن للمدينة
  setShippingRate(cityId: number | string, data: Record<string, any>) {
    return adminApi.setCityShippingRate<SuccessApiResponse<any>, Record<string, any>>(cityId, data);
  },

  removeShippingRate(cityId: number | string, courierId: number | string) {
    return adminApi.removeCityShippingRate<SuccessApiResponse<null>>(cityId, courierId);
  },

};

export default cityService;