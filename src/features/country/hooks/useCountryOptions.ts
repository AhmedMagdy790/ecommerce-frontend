// src/features/country/hooks/useCountryOptions.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { locationService } from "@/services/locationService";
import type { Country } from "../model/types/country.types";
import type { Option } from "@/shared/components/CustomSelect";



export function useCountryOptions() {
  const { lang } = useLang();

  const [countries, setCountries] = useState<Country<string>[]>([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    setIsCountriesLoading(true);
    setError(null);

    try {
      const result = await locationService.getCountries();
      setCountries(result);
    } catch {
      setError("تعذر تحميل الدول.");
    } finally {
      setIsCountriesLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      try {
        const result = await locationService.getCountries();

        if (active) {
          setCountries(result);
          setError(null);
        }
      } catch {
        if (active) {
          setError("تعذر تحميل الدول.");
        }
      } finally {
        if (active) {
          setIsCountriesLoading(false);
        }
      }
    };

    void loadCountries();

    return () => {
      active = false;
    };
  }, []);

  const countryOptions = useMemo<Option[]>(
    () =>
      countries.map((country) => ({
        label: getLocalizedName(country.name, lang),
        value: country.id,
      })),
    [countries, lang],
  );

  return {
    countryOptions,
    isCountriesLoading,
    error,
    refreshCountries: fetchCountries,
  };
}