// src/features/country/hooks/useCountryOptions.ts

import { useEffect, useMemo } from "react";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { useCountryStore } from "../model/store/useCountryStore";

export function useCountryOptions() {
  const { lang } = useLang();

  const countries = useCountryStore((state) => state.items);
  const fetchCountries = useCountryStore((state) => state.fetch);
  const isCountriesLoading = useCountryStore((state) => state.isFetching);

  useEffect(() => {
    if (!countries || countries.length === 0) {
      fetchCountries({});
    }
  }, [countries, fetchCountries]);

  const countryOptions = useMemo(() => {
    return (countries || []).map((country) => ({
      label: getLocalizedName(country.name, lang),
      value: country.id,
    }));
  }, [countries, lang]);

  return {
    countryOptions,
    isCountriesLoading,
  };
}