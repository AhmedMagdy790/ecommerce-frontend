import { type Draft } from "immer";
import menuService from "../../api/menuService";
import type { NavigationLocation } from "../types/navigation.types";
import { createAsyncAction } from "@/shared/store/asyncAction"; // استيراد الوظيفة المركزية
import navigationAdapter from "../../adapters/navigation.adapter";

/* =========================================================
 * State & Actions Interface
 * =======================================================*/

export interface NavigationLocationsState {
  locations: NavigationLocation[];
  isLoadingLocations: boolean;
  locationsError: string | null;
  fetchLocations: () => Promise<void>;
}

/* =========================================================
 * Slice Creator
 * =======================================================*/

export const createNavigationLocationsSlice = <TState extends NavigationLocationsState>(
  set: (updater: (state: Draft<TState>) => void) => void
): NavigationLocationsState => ({
  locations: [],
  isLoadingLocations: false,
  locationsError: null,

  fetchLocations: async () => {

    const executeFetch = createAsyncAction(
      set,
      "isLoadingLocations",
      "locationsError"
    );

    await executeFetch(async () => {
      const response = await menuService.getLocations();

      const locations = navigationAdapter.extractLocations(response);

      set((state) => {
        state.locations = locations;
      });
    }, "فشل تحميل مواقع القوائم");
  },
});