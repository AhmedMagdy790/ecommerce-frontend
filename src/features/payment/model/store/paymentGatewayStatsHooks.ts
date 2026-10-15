import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { PaymentGateway, PaymentGatewayStats } from "../types/payment.types";



export const paymentGatewayStatsStore =
  createEntityStatsStore<PaymentGatewayStats>();

export const paymentGatewayStatsHooks = {
  onFetched: (
    stats: PaymentGatewayStats | null | undefined
  ) => {
    if (!stats) return;

    paymentGatewayStatsStore
      .getState()
      .setStats(stats);
  },

  onCreated: (
    item: PaymentGateway
  ) => {
    const store =
      paymentGatewayStatsStore.getState();

    store.increment("total");

    if (item.is_active) {
      store.increment("active");
    } else {
      store.increment("inactive");
    }
  },

  onDeleted: (
    _id: number | string,
    previousItem?: PaymentGateway
  ) => {
    if (!previousItem) return;

    const store =
      paymentGatewayStatsStore.getState();

    store.decrement("total");

    if (previousItem.is_active) {
      store.decrement("active");
    } else {
      store.decrement("inactive");
    }
  },

  onToggled: (
    item: PaymentGateway,
    previousStatus: boolean
  ) => {
    const store =
      paymentGatewayStatsStore.getState();

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