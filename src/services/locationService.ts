// src/services/locationService.ts

import { storeApi } from "@/api/client";
import type { City } from "@/features/city/model/types/city.types";
import type { Country } from "@/features/country/model/types/country.types";


export const locationService = {
  async getCountries(): Promise<Country<string>[]> {
    try {
      const response = await storeApi.getCountries<{ data: { countries: Country<string>[] } }>();
      return response.data.countries;
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      throw error;
    }
  },

  async getCities(countryId: number): Promise<City<string>[]> {
    try {
      const response = await storeApi.getCities<{ data: { cities: City<string>[] } }>(countryId);
      return response.data.cities;
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      throw error;
    }
  },
};