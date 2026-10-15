import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { ShippingCourier, ShippingStats } from "../types/shipping.types";



export const ShippingStatsStore =
  createEntityStatsStore<ShippingStats>();

export const ShippingStatsHooks = {
  onFetched: (
    stats: ShippingStats | null | undefined
  ) => {
    if (!stats) return;

    ShippingStatsStore
      .getState()
      .setStats(stats);
  },

  onCreated: (
    item: ShippingCourier
  ) => {
    const store =
      ShippingStatsStore.getState();

    store.increment("total");

    if (item.is_active) {
      store.increment("active");
    } else {
      store.increment("inactive");
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: ShippingCourier
  ) => {
    if (!previousItem) return;

    const store =
      ShippingStatsStore.getState();

    store.decrement("total");
    store.increment("trashed");

    if (previousItem.is_active) {
      store.decrement("active");
    } else {
      store.decrement("inactive");
    }
  },

  onToggled: (
    item: ShippingCourier,
    previousStatus: boolean
  ) => {
    const store =
      ShippingStatsStore.getState();

    if (previousStatus) {
      store.decrement("active");
    } else {
      store.decrement("inactive");
    }

    if (item.is_active) {
      store.increment("active");
    } else {
      store.increment("inactive");
    }
  },
};