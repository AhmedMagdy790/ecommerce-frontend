import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { Category, CategorySummary } from "../types/category.types";


export const categoryStatsStore =
  createEntityStatsStore<CategorySummary>();

export const categoryStatsHooks = {
  onFetched: (
    stats: CategorySummary | null | undefined
  ) => {
    if (!stats) return;

    categoryStatsStore
      .getState()
      .setStats(stats);
  },

  onCreated: (
    item: Category
  ) => {
    const store =
      categoryStatsStore.getState();

    store.increment("total");

    if (item.status == "active") {
      store.increment("active");
    } else {
      store.increment("inactive");
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: Category
  ) => {
    if (!previousItem) return;

    const store =
      categoryStatsStore.getState();

    store.decrement("total");

    if (previousItem.status == "active") {
      store.decrement("active");
    } else {
      store.decrement("inactive");
    }
  },

  onToggled: (
    item: Category,
    previousStatus: boolean
  ) => {
    const store =
      categoryStatsStore.getState();

    if (previousStatus) {
      store.decrement("active");
    } else {
      store.decrement("inactive");
    }

    if (item.status == "active") {
      store.increment("active");
    } else {
      store.increment("inactive");
    }
  },
};