// src/pages/Checkout/hooks/useLocations.ts

import { useState, useEffect } from "react";
import { locationService } from "@/services/locationService";
import type { Country, City } from "@/shared/types/location";

export function useLocations(countryId?: string | number) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  
  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [citiesError, setCitiesError] = useState<string | null>(null);

  // Fetch countries on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchCountries() {
      try {
        setLoadingCountries(true);
        setCountriesError(null);
        const response = await locationService.getCountries();
        
        console.log("response", response)
        // استخراج الـ items بشكل آمن سواء كان الرد مصفوفة مباشرة أو داخل كائن الـ Smart Pagination
        const responseData = response?.data || response;
        const items = responseData?.items || (Array.isArray(responseData) ? responseData : []);

        if (isMounted) {
          setCountries(items);
        }
      } catch (err) {
        if (isMounted) {
          setCountriesError(err instanceof Error ? err.message : "Failed to load countries");
        }
      } finally {
        if (isMounted) {
          setLoadingCountries(false);
        }
      }
    }

    fetchCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch cities whenever countryId changes
  useEffect(() => {
    if (!countryId) {
      setCities([]);
      setCitiesError(null);
      return;
    }

    let isMounted = true;

    async function fetchCities() {
      try {
        setLoadingCities(true);
        setCitiesError(null);
        const response = await locationService.getCities(countryId);
        
        // نفس الشيء للمدن في حال كانت تستخدم نفس نمط الاستجابة
        const responseData = response?.data || response;
        const items = responseData?.items || (Array.isArray(responseData) ? responseData : []);

        if (isMounted) {
          setCities(items);
        }
      } catch (err) {
        if (isMounted) {
          setCitiesError(err instanceof Error ? err.message : "Failed to load cities");
          setCities([]);
        }
      } finally {
        if (isMounted) {
          setLoadingCities(false);
        }
      }
    }

    fetchCities();

    return () => {
      isMounted = false;
    };
  }, [countryId]);

  return {
    countries,
    cities,
    loadingCountries,
    loadingCities,
    countriesError,
    citiesError,
  };
}