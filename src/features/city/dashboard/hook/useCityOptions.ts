// src/features/city/hooks/useCityOptions.ts

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { locationService } from "@/services/locationService";
import type { City } from "../../model/types/city.types";
import type { Option } from "@/shared/components/CustomSelect";

export function useCityOptions(countryId?: number) {
  const { lang } = useLang();

  const [cityState, setCityState] = useState<{
    countryId: number;
    cities: City<string>[];
    isLoading: boolean;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    let active = true;

    if (countryId == null) {
      return;
    }

    const loadCities = async () => {
      setCityState({ countryId, cities: [], isLoading: true, error: null });

      try {
        const result = await locationService.getCities(countryId);

        if (active) {
          setCityState({ countryId, cities: result, isLoading: false, error: null });
        }
      } catch {
        if (active) {
          setCityState({
            countryId,
            cities: [],
            isLoading: false,
            error: "تعذر تحميل المدن.",
          });
        }
      }
    };

    // Defer state updates until after the effect body to avoid cascading renders.
    void Promise.resolve().then(() => {
      if (active) {
        return loadCities();
      }
    });

    return () => {
      active = false;
    };
  }, [countryId]);

  const cityOptions = useMemo<Option[]>(
    () =>
      (countryId != null && cityState?.countryId === countryId
        ? cityState.cities
        : []
      ).map((city) => ({
        label: getLocalizedName(city.name, lang),
        value: city.id,
      })),
    [cityState, countryId, lang],
  );

  const currentState =
    countryId != null && cityState?.countryId === countryId ? cityState : null;

  return {
    cityOptions,
    isCitiesLoading: currentState?.isLoading ?? false,
    error: currentState?.error ?? null,
  };
}