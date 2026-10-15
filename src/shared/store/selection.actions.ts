// src/shared/store/selection.actions.ts
import { type StateCreator } from "zustand";

export interface SelectionState {
  selectedIds: (number | string)[];
}

export interface SelectionActions {
  toggleSelect(id: number | string): void;
  selectAll(ids: (number | string)[]): void;
  clearSelection(): void;
  isItemSelected(id: number | string): boolean;
}

export type SelectionStore = SelectionState & SelectionActions;

export function createSelectionStore(): StateCreator<SelectionStore> {
  return (set, get) => ({
    selectedIds: [],

    toggleSelect: (id) => {
      set((state) => {
        const exists = state.selectedIds.includes(id);
        return {
          selectedIds: exists
            ? state.selectedIds.filter((item) => item !== id)
            : [...state.selectedIds, id],
        };
      });
    },

    selectAll: (ids) => {
      set({ selectedIds: ids });
    },

    clearSelection: () => {
      set({ selectedIds: [] });
    },

    isItemSelected: (id) => {
      return get().selectedIds.includes(id);
    },
  });
}