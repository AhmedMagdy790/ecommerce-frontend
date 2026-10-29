// src/features/order/store/orderStatus.ts

import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { Order, OrderStatsData, OrderStatus } from "../types/order.types";

export const orderStatsStore =
  createEntityStatsStore<OrderStatsData>();

export const orderStatusHooks = {
  onFetched: (stats: OrderStatsData | null | undefined) => {
    if (!stats) return;
    orderStatsStore.getState().setStats(stats);
  },

  onCreated: (item: Order) => {
    const store = orderStatsStore.getState();

    store.increment("total");

    const statusKey = item.status;
    if (statusKey) {
      store.increment(statusKey);
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: Order
  ) => {
    if (!previousItem) return;

    const store = orderStatsStore.getState();

    store.decrement("total");
    
    const prevStatus = previousItem.status;
    if (prevStatus) {
      store.decrement(prevStatus);
    }

    store.increment("trashed");
  },

  onStatusChanged: (
    item: Order,
    previousStatus: OrderStatus
  ) => {
    const store = orderStatsStore.getState();

    if (previousStatus) {
      store.decrement(previousStatus);
    }

    const newStatus = item.status;
    if (newStatus) {
      store.increment(newStatus);
    }
  },

  onRestored: (
    item: Order
  ) => {
    const store = orderStatsStore.getState();

    store.increment("total");
    store.decrement("trashed");

    const currentStatus = item.status;
    if (currentStatus) {
      store.increment(currentStatus);
    }
  },
};