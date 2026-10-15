// src/shared/store/stats.store.ts

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface StatusStats {
  total: number;
  active: number;
  inactive: number;
  trashed?: number;
}

export interface InventoryStats {
  total: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  trashed?: number;
}

export type EntityKey =
  | "courier"
  | "city"
  | "rate"
  | "country"
  | "category"
  | "inventory"
  | "address"
  | "paymentGateway"
  | "product";

export type StatusEntity =
  | "courier"
  | "city"
  | "rate"
  | "country"
  | "category"
  | "address"
  | "paymentGateway"
  | "product";

export interface EntityStatsMap {
  courier: StatusStats;
  city: StatusStats;
  rate: StatusStats;
  country: StatusStats;
  category: StatusStats;
  inventory: InventoryStats;
  address: StatusStats;
  paymentGateway: StatusStats;
  product: ProductStats;
}

export type EntityStats<K extends EntityKey> =
  EntityStatsMap[K];

interface StatusCenterState {
  status: Partial<EntityStatsMap>;

  set<K extends EntityKey>(
    entity: K,
    stats: EntityStatsMap[K],
  ): void;

  // 🟢 ربط الدوال بالنوع العام K لضمان توافق customAction والأنواع بدقة
  create<K extends EntityKey>(
    entity: K,
    isActive: boolean,
    customAction?: (current: EntityStatsMap[K]) => void
  ): void;

  delete<K extends EntityKey>(
    entity: K,
    isActive: boolean,
    customAction?: (current: EntityStatsMap[K]) => void
  ): void;

  trash<K extends EntityKey>(
    entity: K,
    isActive: boolean,
    customAction?: (current: EntityStatsMap[K]) => void
  ): void;

  restore<K extends EntityKey>(
    entity: K,
    isActive: boolean,
    customAction?: (current: EntityStatsMap[K]) => void
  ): void;

  forceDelete<K extends EntityKey>(
    entity: K,
    customAction?: (current: EntityStatsMap[K]) => void
  ): void;

  toggle<K extends EntityKey>(
    entity: K,
    wasActive: boolean,
    customAction?: (current: EntityStatsMap[K]) => void
  ): void;

  reset(
    entity: EntityKey,
  ): void;
}

// دالة لإنشاء قيمة افتراضية آمنة حسب نوع الكيان دون تضارب
const createEmptyStats = <K extends EntityKey>(entity: K): EntityStatsMap[K] => {
  if (entity === "inventory") {
    return { total: 0, in_stock: 0, low_stock: 0, out_of_stock: 0 } as EntityStatsMap[K];
  }
  if (entity === "product") {
    return { total: 0, active: 0, draft: 0, archived: 0, trashed: 0 } as EntityStatsMap[K];
  }
  return { total: 0, active: 0, inactive: 0, trashed: 0 } as EntityStatsMap[K];
};

export const useStatusCenter =
  create<StatusCenterState>()(
    immer((set) => ({
      status: {},

      set(entity, stats) {
        set((state) => {
          state.status = {
            ...state.status,
            [entity]: stats,
          } as Partial<EntityStatsMap>;
        });
      },

      create(entity, isActive, customAction) {
        set((state) => {
          const current =
            (state.status[entity] ?? createEmptyStats(entity)) as EntityStatsMap[typeof entity];

          if (customAction) {
            customAction(current);
            state.status[entity] = current;
            return;
          }

          current.total++;

          if ("active" in current && "inactive" in current) {
            if (isActive) {
              current.active++;
            } else {
              current.inactive++;
            }
          }

          state.status[entity] = current;
        });
      },

      delete(entity, isActive, customAction) {
        set((state) => {
          const current =
            (state.status[entity] ?? createEmptyStats(entity)) as EntityStatsMap[typeof entity];

          if (customAction) {
            customAction(current);
            state.status[entity] = current;
            return;
          }

          current.total = Math.max(0, current.total - 1);

          if ("active" in current && "inactive" in current) {
            if (isActive) {
              current.active = Math.max(0, current.active - 1);
            } else {
              current.inactive = Math.max(0, current.inactive - 1);
            }
          }

          if ("trashed" in current) {
            current.trashed = (current.trashed ?? 0) + 1;
          }

          state.status[entity] = current;
        });
      },

      trash(entity, isActive, customAction) {
        set((state) => {
          const current =
            (state.status[entity] ?? createEmptyStats(entity)) as EntityStatsMap[typeof entity];

          if (customAction) {
            customAction(current);
            state.status[entity] = current;
            return;
          }

          current.total = Math.max(0, current.total - 1);

          if ("trashed" in current) {
            current.trashed = (current.trashed ?? 0) + 1;
          }

          if ("active" in current && "inactive" in current) {
            if (isActive) {
              current.active = Math.max(0, current.active - 1);
            } else {
              current.inactive = Math.max(0, current.inactive - 1);
            }
          }

          state.status[entity] = current;
        });
      },

      restore(entity, isActive, customAction) {
        set((state) => {
          const current =
            (state.status[entity] ?? createEmptyStats(entity)) as EntityStatsMap[typeof entity];

          if (customAction) {
            customAction(current);
            state.status[entity] = current;
            return;
          }

          current.total++;

          if ("trashed" in current) {
            current.trashed = Math.max(0, (current.trashed ?? 0) - 1);
          }

          if ("active" in current && "inactive" in current) {
            if (isActive) {
              current.active++;
            } else {
              current.inactive++;
            }
          }

          state.status[entity] = current;
        });
      },

      forceDelete(entity, customAction) {
        set((state) => {
          const current =
            (state.status[entity] ?? createEmptyStats(entity)) as EntityStatsMap[typeof entity];

          if (customAction) {
            customAction(current);
            state.status[entity] = current;
            return;
          }

          if ("trashed" in current) {
            current.trashed = Math.max(0, (current.trashed ?? 0) - 1);
          }

          state.status[entity] = current;
        });
      },

      toggle(entity, wasActive, customAction) {
        set((state) => {
          const current =
            (state.status[entity] ?? createEmptyStats(entity)) as EntityStatsMap[typeof entity];

          if (customAction) {
            customAction(current);
            state.status[entity] = current;
            return;
          }

          if ("active" in current && "inactive" in current) {
            if (wasActive) {
              current.active = Math.max(0, current.active - 1);
              current.inactive++;
            } else {
              current.inactive = Math.max(0, current.inactive - 1);
              current.active++;
            }
          }

          state.status[entity] = current;
        });
      },

      reset(entity) {
        set((state) => {
          delete state.status[entity];
        });
      },
    })),
  );