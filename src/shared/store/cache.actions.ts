// src/shared/store/cache.actions.ts
import { type StateCreator } from "zustand";

export interface CacheState {
  lastFetchedAt: number | null;
  isDirty: boolean;
}

export interface CacheActions {
  setLastFetched(): void;
  setIsDirty(isDirty: boolean): void;
  invalidate(): void;
}

export function createCacheStore(): StateCreator<CacheState & CacheActions> {
  return (set) => ({
    lastFetchedAt: null,
    isDirty: false,

    setLastFetched: () => {
      set({
        lastFetchedAt: Date.now(),
        isDirty: false,
      });
    },

    setIsDirty: (isDirty) => {
      set({ isDirty });
    },

    invalidate: () => {
      set({ isDirty: true });
    },
  });
}