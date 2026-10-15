// src/shared/store/optimistic.actions.ts

import { type StateCreator } from "zustand";
import { castDraft } from "immer";
import type { Entity } from "./crud.actions";
import type { PaginationMeta } from "../types/api.types";
import { incrementTotal, decrementTotal } from "./crud.helpers";

export interface OptimisticState<T extends Entity> {
  items: T[];
  pagination: PaginationMeta;
  stats?: Record<string, number> | null;
  [key: string]: any;
}

export interface OptimisticActions<T extends Entity> {
  optimisticCreate(tempItem: T, apiCall: () => Promise<void>): Promise<void>;
  optimisticUpdate(updatedItem: T, apiCall: () => Promise<void>): Promise<void>;
  optimisticDelete(id: number | string, apiCall: () => Promise<void>): Promise<void>;
  optimisticRestore(id: number | string, apiCall: () => Promise<void>): Promise<void>;
}

export function createOptimisticStore<
  T extends Entity,
  TState extends OptimisticState<T> = OptimisticState<T>
>(): StateCreator<
  TState,
  [["zustand/immer", never]],
  [],
  OptimisticActions<T>
> {
  return (set, get) => ({
    async optimisticCreate(tempItem, apiCall) {
      const previousState = {
        items: [...get().items],
        pagination: { ...get().pagination },
        stats: get().stats ? { ...get().stats } : null,
      };

      // 1. التحديث المتفائل: إضافة العنصر وتحديث الـ pagination/stats محلياً فورا
      set((state) => {
        state.items.unshift(castDraft(tempItem));
        state.pagination = incrementTotal(state.pagination);
        
        if (state.stats && typeof state.stats.total === 'number') {
          state.stats.total += 1;
        }
      });

      try {
        await apiCall();
      } catch (error) {
        // 2. التراجع (Rollback) في حال فشل الطلب
        set((state) => {
          state.items = castDraft(previousState.items);
          state.pagination = previousState.pagination;
          state.stats = previousState.stats;
        });
        throw error;
      }
    },

    async optimisticUpdate(updatedItem, apiCall) {
      const previousItems = [...get().items];

      set((state) => {
        const index = state.items.findIndex((item) => item.id == updatedItem.id);
        if (index !== -1) {
          state.items[index] = castDraft(updatedItem);
        }
      });

      try {
        await apiCall();
      } catch (error) {
        set((state) => {
          state.items = castDraft(previousItems);
        });
        throw error;
      }
    },

    async optimisticDelete(id, apiCall) {
      const previousState = {
        items: [...get().items],
        pagination: { ...get().pagination },
        stats: get().stats ? { ...get().stats } : null,
      };

      set((state) => {
        state.items = state.items.filter((item) => item.id != id);
        state.pagination = decrementTotal(state.pagination);

        if (state.stats && typeof state.stats.total === 'number') {
          state.stats.total = Math.max(0, state.stats.total - 1);
        }
      });

      try {
        await apiCall();
      } catch (error) {
        set((state) => {
          state.items = castDraft(previousState.items);
          state.pagination = previousState.pagination;
          state.stats = previousState.stats;
        });
        throw error;
      }
    },

    async optimisticRestore(id, apiCall) {
      const previousState = {
        items: [...get().items],
        trashedItems: [...((get()).trashedItems || [])],
        pagination: { ...get().pagination },
        stats: get().stats ? { ...get().stats } : null,
      };

      const trashedItems = (get()).trashedItems || [];
      const itemToRestore = trashedItems.find((item: T) => item.id == id);

      if (itemToRestore) {
        set((state: any) => {
          state.trashedItems = state.trashedItems.filter((item: T) => item.id != id);
          state.items.unshift(castDraft(itemToRestore));
          state.pagination = incrementTotal(state.pagination);

          if (state.stats && typeof state.stats.total === 'number') {
            state.stats.total += 1;
          }
        });
      }

      try {
        await apiCall();
      } catch (error) {
        set((state) => {
          state.items = castDraft(previousState.items);
          state.pagination = previousState.pagination;
          state.stats = previousState.stats;
        });
        throw error;
      }
    },
  });
}