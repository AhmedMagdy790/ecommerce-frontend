// src/shared/store/search.actions.ts
import { type StateCreator } from "zustand";

export interface SearchState {
  search: string;
}

export interface SearchActions {
  setSearch(search: string): void;
  resetSearch(): void;
}

export interface SearchOptions {
  defaultSearch?: string;
}

export function createSearchStore(
  options?: SearchOptions
): StateCreator<SearchState & SearchActions> {
  const defaultSearch = options?.defaultSearch ?? "";

  return (set, get) => ({
    search: defaultSearch,

    setSearch: (search) => {
      if (get().search !== search) {
        set({ search });
      }
    },

    resetSearch: () => {
      set({ search: defaultSearch });
    },
  });
}