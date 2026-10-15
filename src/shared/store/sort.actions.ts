// src/shared/store/sort.actions.ts
import { type StateCreator } from "zustand";

export type SortDirection = "asc" | "desc";

export interface SortState<TField extends string = string> {
  sortBy: TField | null;
  sortDirection: SortDirection;
}

export interface SortActions<TField extends string = string> {
  setSort(sortBy: TField, direction?: SortDirection): void;
  resetSort(): void;
}

export interface SortOptions<TField extends string = string> {
  defaultSortBy?: TField | null;
  defaultDirection?: SortDirection;
}

export function createSortStore<TField extends string = string>(
  options?: SortOptions<TField>
): StateCreator<SortState<TField> & SortActions<TField>> {
  const defaultSortBy = options?.defaultSortBy ?? null;
  const defaultDirection = options?.defaultDirection ?? "asc";

  return (set, get) => ({
    sortBy: defaultSortBy,
    sortDirection: defaultDirection,

    setSort: (sortBy, direction) => {
      const currentSortBy = get().sortBy;
      const currentDirection = get().sortDirection;

      // If clicking the same field, toggle direction if direction wasn't explicitly passed
      let newDirection = direction;
      if (!newDirection && currentSortBy === sortBy) {
        newDirection = currentDirection === "asc" ? "desc" : "asc";
      }

      set({
        sortBy,
        sortDirection: newDirection ?? "asc",
      });
    },

    resetSort: () => {
      set({
        sortBy: defaultSortBy,
        sortDirection: defaultDirection,
      });
    },
  });
}