// src/shared/store/pagination.actions.ts
import { type StateCreator } from "zustand";

export interface PaginationState {
  page: number;
  perPage: number;
}

export interface PaginationActions {
  setPage(page: number): void;
  setPerPage(perPage: number): void;
  resetPagination(): void;
}

export interface PaginationOptions {
  defaultPage?: number;
  defaultPerPage?: number;
}

export function createPaginationStore(
  options?: PaginationOptions
): StateCreator<PaginationState & PaginationActions> {
  const defaultPage = options?.defaultPage ?? 1;
  const defaultPerPage = options?.defaultPerPage ?? 10;

  return (set) => ({
    page: defaultPage,
    perPage: defaultPerPage,

    setPage: (page) => {
      set({ page });
    },

    setPerPage: (perPage) => {

      set({ perPage, page: 1 });
    },

    resetPagination: () => {
      set({
        page: defaultPage,
        perPage: defaultPerPage,
      });
    },
  });
}