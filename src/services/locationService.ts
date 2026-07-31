// src/services/locationService.ts

import { storeApi } from "@/api/client";
import type { City, Country } from "@/shared/types/location";



export const locationService = {
  async getCountries(): Promise<Country[]> {
    try {
      const response = await storeApi.getCountries();
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      throw error;
    }
  },

  async getCities(countryId: string | number): Promise<City[]> {
    try {
      const response = await storeApi.getCities(countryId);
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      throw error;
    }
  },
};