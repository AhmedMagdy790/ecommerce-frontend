import { useState, useEffect, useRef } from "react";
import { useCountryStore } from "../model/store/useCountryStore";
import { useCityStore } from "@/features/city/model/store/city.store";


export function useCountryCity(initialCountryId?: number | string) {
  const [selectedCountryId, setSelectedCountryId] = useState<number | string | undefined>(
    initialCountryId
  );

  const lastFetchedCountryId = useRef<number | string | undefined>(initialCountryId);

  const countries = useCountryStore((state) => state.items);
  const fetchCountries = useCountryStore((state) => state.fetch);
  const isCountriesLoading = useCountryStore((state) => state.isFetching);

  const cities = useCityStore((state) => state.items);
  const fetchCitiesByStore = useCityStore((state) => state.fetch);
  const isCitiesLoading = useCityStore((state) => state.isFetching);

  useEffect(() => {
    if (!countries || countries.length === 0) {
      fetchCountries();
    }
  }, [countries, fetchCountries]);

  useEffect(() => {
    if (!selectedCountryId) return;

    if (lastFetchedCountryId.current === selectedCountryId) return;

    lastFetchedCountryId.current = selectedCountryId;

    fetchCitiesByStore({ countryId: selectedCountryId });
  }, [selectedCountryId, fetchCitiesByStore]);

  const fetchCities = (countryId: number | string) => {
    setSelectedCountryId(countryId);
  };

  return {
    countries,
    cities,
    fetchCities,
    isLoadingCities: isCitiesLoading,
    isLoadingCountries: isCountriesLoading,
    selectedCountryId,
  };
}