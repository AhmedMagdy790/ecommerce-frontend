import { createEntityStatsStore } from "@/shared/store/createEntityStatsStore";
import type { ManagerStats } from "../types/manager.types";
import type { User } from "@/features/users/model/types/user.types";

export const ManagerStatsStore =
  createEntityStatsStore<ManagerStats>();

const updateStatusCount = (
  status: User["status"],
  action: "increment" | "decrement"
) => {
  ManagerStatsStore.getState()[action](status);
};

export const ManagerStatsHooks = {
  onFetched: (stats: ManagerStats | null | undefined) => {
    if (!stats) return;

    ManagerStatsStore.getState().setStats(stats);
  },

  onCreated: (item: User) => {
    const store = ManagerStatsStore.getState();

    store.increment("total");
    updateStatusCount(item.status, "increment");
  },

  onDeleted: (_id: number | string, previousItem?: User) => {
    if (!previousItem) return;

    const store = ManagerStatsStore.getState();

    store.decrement("total");
    updateStatusCount(previousItem.status, "decrement");
  },

  onStatusChanged: (
    item: User,
    previousStatus: User["status"]
  ) => {
    if (item.status === previousStatus) return;

    updateStatusCount(previousStatus, "decrement");
    updateStatusCount(item.status, "increment");
  },
};