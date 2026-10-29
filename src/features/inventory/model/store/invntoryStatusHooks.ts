
import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { Inventory, InventoryStats } from "../types/inventory.types";

export const inventoryStatsStore =
  createEntityStatsStore<InventoryStats>();

const getStockCategory = (
  availableStock: number,
): keyof Omit<InventoryStats, "total"> => {
  if (availableStock <= 0) return "out_of_stock";
  if (availableStock <= 10) return "low_stock";

  return "in_stock";
};

export const inventoryStatsHooks = {
  onFetched: (stats: InventoryStats | null | undefined) => {
    if (!stats) return;

    inventoryStatsStore.getState().setStats(stats);
  },

  onCreated: (item: Inventory) => {
    const store = inventoryStatsStore.getState();

    store.increment("total");
    store.increment(getStockCategory(item.available_stock));
  },

  onDeleted: (
    _id: number | string,
    previousItem?: Inventory,
  ) => {
    if (!previousItem) return;

    const store = inventoryStatsStore.getState();

    store.decrement("total");
    store.decrement(getStockCategory(previousItem.available_stock));
  },
};