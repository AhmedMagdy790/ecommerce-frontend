import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { City, CityStats } from "../types/city.types";


export const cityStatsStore =
  createEntityStatsStore<CityStats>();

export const cityStatusHooks = {
  onFetched: (stats: CityStats | null | undefined) => {
    if (!stats) return;

    cityStatsStore.getState().setStats(stats);
  },

  onCreated: (item: City) => {
    const store = cityStatsStore.getState();

    store.increment("total");

    if (item.is_active) {
      store.increment("active");
    } else {
        store.increment("inactive")
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: City
  ) => {
    if (!previousItem) return;

    const store = cityStatsStore.getState();

    store.decrement("total");
    store.increment("trashed");

    if (previousItem.is_active) {
      store.decrement("active");
    } else {
        store.decrement("inactive")
    }

  },

  onToggled: (
    item: City,
    previousStatus: boolean
  ) => {
    const store = cityStatsStore.getState();

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