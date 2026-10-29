import { create } from "zustand";
import { immer } from "zustand/middleware/immer";



export type NumericKeys<T extends object> = {
  [K in keyof T]-?:
    NonNullable<T[K]> extends number ? K : never;
}[keyof T];

function updateNumericStat(
  stats: object,
  key: PropertyKey,
  delta: 1 | -1,
): void {
  const record = stats as Record<PropertyKey, unknown>;
  const currentValue = record[key];

  if (
    typeof currentValue !== "number" ||
    !Number.isFinite(currentValue)
  ) {
    return;
  }

  record[key] = Math.max(0, currentValue + delta);
}

export interface EntityStatsState<TStats extends object> {
  stats: TStats | null;

  setStats: (stats: TStats) => void;
  increment: (key: NumericKeys<TStats>) => void;
  decrement: (key: NumericKeys<TStats>) => void;
  reset: () => void;
}

export function createEntityStatsStore<TStats extends object>() {
  return create<EntityStatsState<TStats>>()(
    immer((set) => ({
      stats: null,

      setStats: (stats) => {
        set({ stats });
      },
      
      increment: (key) =>
        set((state) => {
          if (!state.stats) return;
          updateNumericStat(state.stats, key, 1);
        }),

      decrement: (key) =>
        set((state) => {
          if (!state.stats) return;
          updateNumericStat(state.stats, key, -1);
        }),


      reset: () => {
        set({ stats: null });
      },
    })),
  );
}