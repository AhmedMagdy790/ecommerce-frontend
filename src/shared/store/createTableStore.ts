import { type StateCreator } from "zustand";

export interface TableState<
  Filters extends Record<string, unknown>
> {
  page: number;
  perPage: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
  filters: Filters;
  search: string;
  selectedIds: (number | string)[];
  showTrashed: boolean;
}

export interface TableActions<Filters extends Record<string, unknown>> {
  setPage(page: number): void;
  setPerPage(perPage: number): void;
  setSort(
    sortBy: string,
    direction?: "asc" | "desc",
  ): void;
  setFilters(filters: Partial<Filters>): void;
  resetFilters(): void;
  setSearch(search: string): void;
  toggleSelect(id: number | string): void;
  selectAll(ids: (number | string)[]): void;
  toggleSelectAll(ids: (number | string)[]): void;
  clearSelection(): void;
  isItemSelected(id: number | string): boolean;
  resetStore(): void;
  setShowTrashed(showTrashed: boolean): void;
}

export interface TableOptions<Filters extends Record<string, unknown>> {
  defaultPerPage?: number;
  defaultSortBy?: string;
  defaultSortDirection?: "asc" | "desc";
  defaultFilters: Filters;
}

export type TableSlice<Filters extends Record<string, unknown>> =
  TableState<Filters> &
  TableActions<Filters>;

export function createTableStore<
  Filters extends Record<string, unknown>,
  TState extends TableSlice<Filters> = TableSlice<Filters>,
>(
  options: TableOptions<Filters>,
): StateCreator<
  TState,
  [["zustand/immer", never]],
  [],
  TableSlice<Filters>
> {
  const {
    defaultPerPage = 10,
    defaultSortBy = "id",
    defaultSortDirection = "desc",
    defaultFilters,
  } = options;

  const initialState: TableState<Filters> = {
    page: 1,
    perPage: defaultPerPage,
    sortBy: defaultSortBy,
    sortDirection: defaultSortDirection,
    filters: defaultFilters,
    search: "",
    selectedIds: [],
    showTrashed: false,
  };

  return (set, get) => ({
    ...initialState,

    setShowTrashed: (showTrashed) =>
      set((state) => {
        state.showTrashed = showTrashed;
      }),

    setPage: (page) =>
      set((state) => {
        state.page = page;
      }),

    setPerPage: (perPage) =>
      set((state) => {
        state.perPage = perPage;
        state.page = 1;
      }),

    setSort: (sortBy, direction) =>
      set((state) => {
        const isSameSort = state.sortBy === sortBy;

        state.sortDirection =
          direction ??
          (isSameSort &&
          state.sortDirection === "asc"
            ? "desc"
            : "asc");

        state.sortBy = sortBy;
      }),

      setFilters: (newFilters) =>
        set((state) => {
          Object.assign(state.filters, newFilters);
          state.page = 1;
        }),

      resetFilters: () =>
        set((state) => {
          Object.keys(state.filters).forEach((key) => {
            delete (state.filters as Record<string, unknown>)[key];
          });
          Object.assign(state.filters, defaultFilters);
          state.page = 1;
        }),

    setSearch: (search) =>
      set((state) => {
        state.search = search;
        state.page = 1;
      }),

    toggleSelect: (id) =>
      set((state) => {
        const exists =
          state.selectedIds.includes(id);

        state.selectedIds = exists
          ? state.selectedIds.filter(
              (item) => item !== id,
            )
          : [...state.selectedIds, id];
      }),

    selectAll: (ids) =>
      set((state) => {
        state.selectedIds = ids;
      }),

    toggleSelectAll: (ids) =>
      set((state) => {
        const allSelected =
          ids.length > 0 &&
          ids.every((id) => state.selectedIds.includes(id));

        state.selectedIds = allSelected
          ? state.selectedIds.filter((id) => !ids.includes(id))   // امسح بس الـ ids دي
          : Array.from(new Set([...state.selectedIds, ...ids]));
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedIds = [];
      }),

    isItemSelected: (id) =>
      get().selectedIds.includes(id),

    resetStore: () =>
      set((state) => {
        state.page = initialState.page;
        state.perPage = initialState.perPage;
        state.sortBy = initialState.sortBy;
        state.sortDirection =
          initialState.sortDirection;
        
        Object.keys(state.filters).forEach((key) => {
          delete (state.filters as Record<string, unknown>)[key];
        });
        Object.assign(state.filters, initialState.filters);

        state.search = initialState.search;
        state.selectedIds = [];
        state.showTrashed =
          initialState.showTrashed;
      }),
  });
}