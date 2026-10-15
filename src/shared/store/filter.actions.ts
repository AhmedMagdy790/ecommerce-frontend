// src/shared/store/filter.actions.ts
import { type StateCreator } from "zustand";

export interface FilterState<Filters> {
  filters: Filters;
}

export interface FilterActions<Filters> {
  setFilters(newFilters: Partial<Filters>): void;
  resetFilters(): void;
}

export interface FilterOptions<Filters> {
  defaultFilters: Filters;
}

export function createFilterStore<Filters>(
  options: FilterOptions<Filters>
): StateCreator<FilterState<Filters> & FilterActions<Filters>> {
  const { defaultFilters } = options;

  return (set) => ({
    filters: defaultFilters,

    setFilters: (newFilters) => {
      set((state) => ({
        filters: {
          ...state.filters,
          ...newFilters,
        },
      }));
    },

    resetFilters: () => {
      set({ filters: defaultFilters });
    },
  });
}