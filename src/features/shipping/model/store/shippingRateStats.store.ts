// src/features/shipping/model/store/shippingRateStats.store.ts

import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { ShippingRate } from "../types/rate.types";
import type { ShippingStats } from "../types/shipping.types"; // أو نوع الإحصائيات الخاص بك
import type { TranslatedText } from "@/shared/types/types";

export const ShippingRateStatsStore =
  createEntityStatsStore<ShippingStats>();

export const ShippingRateStatsHooks = {
  onFetched: (
    stats: ShippingStats | null | undefined
  ) => {
    if (!stats) return;

    ShippingRateStatsStore
      .getState()
      .setStats(stats);
  },

  onCreated: (
    item: ShippingRate<TranslatedText>
  ) => {
    const store = ShippingRateStatsStore.getState();

    store.increment("total");

    // قراءة الحالة من settings.is_active للهيكل المتداخل
    if (item.settings?.is_active) {
      store.increment("active");
    } else {
      store.increment("inactive");
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: ShippingRate<TranslatedText>
  ) => {
    if (!previousItem) return;

    const store = ShippingRateStatsStore.getState();

    store.decrement("total");
    store.increment("trashed");

    if (previousItem.settings?.is_active) {
      store.decrement("active");
    } else {
      store.decrement("inactive");
    }
  },

  onToggled: (
    item: ShippingRate<TranslatedText>,
    previousStatus: boolean
  ) => {
    const store = ShippingRateStatsStore.getState();

    if (previousStatus) {
      store.decrement("active");
    } else {
      store.decrement("inactive");
    }

    if (item.settings?.is_active) {
      store.increment("active");
    } else {
      store.increment("inactive");
    }
  },
};