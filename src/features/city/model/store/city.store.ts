// src/features/cities/model/store/city.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";

import type {
  SuccessApiResponse,
} from "@/shared/types/api.types";

import type {
  City,
  CityFilters,
} from "../types/city.types";

import type {
  CityFormData,
} from "../schema/citySchema";

import cityService from "../../api/city.service";
import { cityAdapter } from "../../adapters/city.adapter";
import { cityStatusHooks } from "./CityStatusHooks";
import type { TranslatedText } from "@/shared/types/types";
import type { CityListResponse, CitySingleResponse } from "../types/city.api";

// ======================================================
// Store
// ======================================================

export const useCityStore =
  createFeatureStore<
    City<TranslatedText>,
    CityFormData,
    Partial<CityFormData>,
    CityFilters,
    CityListResponse,
    CitySingleResponse,
    SuccessApiResponse<null>,
    CitySingleResponse,
    void,
    void,
    void
  >({
    name: "CityStore",

    // ==================================================
    // Service
    // ==================================================

    service:
      cityService,

    // ==================================================
    // Adapter
    // ==================================================

    adapter:
      cityAdapter,

    // ==================================================
    // Table
    // ==================================================

    defaultFilters:
      {} as CityFilters,

    defaultSortBy:
      "created_at",

    // ==================================================
    // Stats
    // ==================================================


    // ==================================================
    // Lifecycle Hooks
    // ==================================================


    hooks: {
      onFetched: (response) => {
        const stats =
          cityAdapter.extractStats(response);

        cityStatusHooks.onFetched(stats);
      },

      onCreated:
        cityStatusHooks.onCreated,

      onDeleted:
        cityStatusHooks.onDeleted,
    },

  
  toggle: {
    extractItem:
      cityAdapter.fromToggleResponse,

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
        status,
      ) => {
        cityStatusHooks.onToggled(
          item,
          !status,
        );
      },
  

    errorMessage:
      "فشل تغيير حالة بوابة الدفع",
  },
  });