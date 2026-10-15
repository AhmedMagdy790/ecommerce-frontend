import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { Page, PageStats } from "../types/page.types";

export const PageStatsStore =
  createEntityStatsStore<PageStats>();

export const PageStatsHooks = {
  onFetched: (
    stats: PageStats | null | undefined
  ) => {
    if (!stats) return;

    PageStatsStore
      .getState()
      .setStats(stats);
  },

  onCreated: (
    item: Page
  ) => {
    const store =
      PageStatsStore.getState();

    store.increment("total");

    if (item.is_active) {
      store.increment("active");
    } else {
      store.increment("inactive");
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: Page
  ) => {
    if (!previousItem) return;

    const store =
      PageStatsStore.getState();

    store.decrement("total");

    if (previousItem.is_active) {
      store.decrement("active");
    } else {
      store.decrement("inactive");
    }
  },

  onToggled: (
    item: Page,
    previousStatus: boolean
  ) => {
    const store =
      PageStatsStore.getState();

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