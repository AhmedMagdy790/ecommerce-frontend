import { create } from "zustand";
import { immer } from "zustand/middleware/immer";


export interface EntityStatsState<TStats extends object> {
  stats: TStats | null;

  setStats: (stats: TStats) => void;

  increment: (status: keyof TStats) => void;

  decrement: (status: keyof TStats) => void;

  reset: () => void;
}

export function createEntityStatsStore<TStats extends object>() {
  return create<EntityStatsState<TStats>>()(
    immer((set) => ({
      stats: null,

      setStats: (newStats) =>
        set((state) => {
          Object.assign(state, {
            stats: newStats,
          });
        }),

      increment: (status) =>
        set((state) => {
          if (!state.stats) return;

          const key = String(status);
          const currentValue = Number(
            (state.stats as Record<string, unknown>)[key]
          );

          Object.assign(state.stats, {
            [key]: currentValue + 1,
          });
        }),

      decrement: (status) =>
        set((state) => {
          if (!state.stats) return;

          const key = String(status);
          const currentValue = Number(
            (state.stats as Record<string, unknown>)[key]
          );

          Object.assign(state.stats, {
            [key]: Math.max(0, currentValue - 1),
          });
        }),

      reset: () =>
        set((state) => {
          state.stats = null;
        }),
    }))
  );
}