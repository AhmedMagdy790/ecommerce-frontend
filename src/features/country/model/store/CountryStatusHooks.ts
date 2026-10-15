import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { Country, CountryStats } from "../types/country.types";


export const countryStatsStore =
  createEntityStatsStore<CountryStats>();

export const countryStatusHooks = {
  onFetched: (stats: CountryStats | null | undefined) => {
    if (!stats) return;

    countryStatsStore.getState().setStats(stats);
  },

  onCreated: (item: Country) => {
    const store = countryStatsStore.getState();

    store.increment("total");

    if (item.is_active) {
      store.increment("active");
    } else {
        store.increment("inactive")
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: Country
  ) => {
    if (!previousItem) return;

    const store = countryStatsStore.getState();

    store.decrement("total");
    store.increment("trashed");

    if (previousItem.is_active) {
      store.decrement("active");
    } else {
        store.decrement("inactive")
    }

  },

  onToggled: (
    item: Country,
    previousStatus: boolean
  ) => {
    const store = countryStatsStore.getState();

    if (previousStatus) {
      store.decrement("active");
    } else {
        store.decrement("inactive")
    }

    if (item.is_active) {
      store.increment("active");
    } else {
        store.increment("inactive")
    }

  },
};