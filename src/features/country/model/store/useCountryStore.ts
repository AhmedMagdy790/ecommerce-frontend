// src/features/countries/store/country.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";

import countryService from "../../api/country.service";
import { countryAdapter } from "../../adapters/country.adapter";

import type {
  SuccessApiResponse,
} from "@/shared/types/api.types";


import type {
  Country,
  CountryFilters,
} from "../types/country.types";

import type {
  CountryFormData,
} from "../schema/countrySchema";
import { countryStatusHooks } from "./CountryStatusHooks";
import type { CountryListResponse } from "../types/country.api";
import type { TranslatedText } from "@/shared/types/types";


// ======================================================
// Store
// ======================================================

export const useCountryStore =
  createFeatureStore<
    Country<TranslatedText>,
    CountryFormData,
    Partial<CountryFormData>,
    CountryFilters,
    CountryListResponse,
    SuccessApiResponse<{ country: Country<TranslatedText> }>,
    SuccessApiResponse<null>,
    SuccessApiResponse<{ country: Country<TranslatedText> }>,
    void,
    void,
    void
  >({
    name: "CountryStore",

    service: countryService,

    adapter: countryAdapter,

    defaultFilters: {} as CountryFilters,

    defaultSortBy: "created_at",


    hooks: {
      onFetched: (response) => {
        const stats =
          countryAdapter.extractStats(response);
  
        countryStatusHooks.onFetched(stats);
      },
  
      onCreated:
        countryStatusHooks.onCreated,
  
      onDeleted:
        countryStatusHooks.onDeleted,
    },

    // ====================================================
    // Toggle
    // ====================================================

   toggle: {
      extractItem:
        countryAdapter.fromToggleResponse,
  
      getStatus: (item) =>
        item.is_active ?? false,
  
      getNextStatus: (
        currentStatus,
      ) => !currentStatus,
  
      setStatus: (
        item,
        status,
      ) => ({
        ...item,
        is_active: status,
      }),
  
      onChanged: (
          item,
          previousStatus
        ) => {
          countryStatusHooks.onToggled(
            item,
            previousStatus,
          );
        },
    
  
      errorMessage:
        "فشل تغيير حالة بوابة الدفع",
    },
  });