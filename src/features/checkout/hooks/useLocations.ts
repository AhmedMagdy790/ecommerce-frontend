// src/pages/Checkout/hooks/useLocations.ts

import { useState, useEffect, useMemo } from "react";
import { locationService } from "@/services/locationService";
import type { Country } from "@/features/country/model/types/country.types";
import type { City } from "@/features/city/model/types/city.types";
import type { Option } from "@/shared/components/CustomSelect";

export function useLocations(countryId?: number) {
  const [countries, setCountries] = useState<Country<string>[]>([]);
  
  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  const [countriesError, setCountriesError] = useState<string | null>(null);

  const [prevCountryId, setPrevCountryId] = useState(countryId);
  const [cities, setCities] = useState<City<string>[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);

  if (countryId !== prevCountryId) {
    setPrevCountryId(countryId);
    setCities([]);
    setCitiesError(null);
    setLoadingCities(false);
  }

  // Fetch countries on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchCountries() {
      try {
        setLoadingCountries(true);
        setCountriesError(null);
        const countries = await locationService.getCountries();
        
        if (isMounted) {
          setCountries(countries);
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
      return;
    }

    let isMounted = true;

    async function fetchCities() {
      
      try {
        setLoadingCities(true);
        setCitiesError(null);
        const data = await locationService.getCities(Number(countryId));
        
        if (isMounted) {
          setCities(data);
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

  const countryOptions: Option[] = useMemo(() => {
    return (countries || []).map((country) => ({
      label: country.name,
      value: country.id,
    }));
  }, [countries]);

  // تحويل المدن إلى خيارات للـ CustomSelect
  const cityOptions: Option[] = useMemo(() => {
    return (cities || []).map((city) => ({
      label: city.name,
      value: city.id,
    }));
  }, [cities]);

  return {
    countries,
    cities: countryId ? cities : [],
    countryOptions,
    cityOptions,
    loadingCountries,
    loadingCities: countryId ? loadingCities : false,
    countriesError,
    citiesError: countryId ? citiesError : null,
  };
}