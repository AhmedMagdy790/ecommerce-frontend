import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { Inventory, InventoryStats } from "../types/inventory.types";

export const inventoryStatsStore =
  createEntityStatsStore<InventoryStats>();

export const inventoryStatsHooks = {
  onFetched: (
    stats: InventoryStats | null | undefined
  ) => {
    if (!stats) return;

    inventoryStatsStore
      .getState()
      .setStats(stats);
  },

  onCreated: (item: Inventory) => {
    const store =
      inventoryStatsStore.getState();

    store.increment("total");

    if (item.available_quantity === undefined) {
      return;
    }

    if (item.available_quantity <= 0) {
      store.increment("out_of_stock");
    } else if (item.available_quantity <= 10) {
      store.increment("low_stock");
    } else {
      store.increment("in_stock");
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: Inventory
  ) => {
    if (!previousItem) return;

    const store =
      inventoryStatsStore.getState();

    store.decrement("total");

    // هنا نحدد حالة المخزون السابقة وننقص الإحصائية المناسبة
  },
};