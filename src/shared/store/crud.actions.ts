
import { type StateCreator } from "zustand";
import { castDraft, current, type Draft } from "immer";

import { createAsyncAction } from "./asyncAction";

import type { PaginationMeta } from "../types/api.types";
import { DEFAULT_PAGINATION } from "../constants/pagination";

/* =========================================================
 * Types
 * =======================================================*/

export interface CrudMessages {
  fetch?: string;
  create?: string;
  update?: string;
  delete?: string;
}

export type Entity = {
  id: number | string;
};

/* =========================================================
 * State
 * =======================================================*/

export interface CrudState<T extends Entity> {
  items: T[];

  selectedItem: T | null;
  selectedIds: Array<number | string>;

  pagination: PaginationMeta;

  isFetching: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;

  fetchError: string | null;
  submitError: string | null;
  deleteError: string | null;
}

/* =========================================================
 * Actions
 * =======================================================*/

export interface CrudActions<
  T extends Entity,
  CreateDto,
  UpdateDto,
  Filters,
> {
  fetch(filters?: Filters): Promise<void>;

  create(payload: CreateDto): Promise<T | undefined>;

  update(
    id: number | string,
    payload: UpdateDto
  ): Promise<T | undefined>;

  delete(id: number | string): Promise<void>;

  setSelectedItem(item: T | null): void;

  toggleSelectId(id: number | string): void;

  clearErrors(): void;
}

/* =========================================================
 * Slice
 * =======================================================*/

type CrudSlice<
  T extends Entity,
  CreateDto,
  UpdateDto,
  Filters,
> =
  CrudState<T> &
  CrudActions<
    T,
    CreateDto,
    UpdateDto,
    Filters
  >;

/* =========================================================
 * Store Creator
 * =======================================================*/

type FullStoreCreator<TState> =
  StateCreator<
    TState,
    [
      ["zustand/devtools", never],
      ["zustand/immer", never],
    ],
    [],
    TState
  >;

/* =========================================================
 * Lifecycle
 * =======================================================*/

export interface CrudLifecycle<
  T extends Entity,
  CreateDto,
  UpdateDto,
  Filters,
  ListResponse,
  CreateResponse,
  UpdateResponse,
  TState extends CrudSlice<
    T,
    CreateDto,
    UpdateDto,
    Filters
  >,
> {
  onFetched?: (
    response: ListResponse,
    items: T[],
    get: () => TState
  ) => void;

  onCreated?: (
    item: T,
    response: CreateResponse,
    get: () => TState
  ) => void;

  onUpdated?: (
    oldItem: T | undefined,
    newItem: T,
    response: UpdateResponse,
    get: () => TState
  ) => void;

  onDeleted?: (
    id: number | string,
    previousItem: T | undefined,
    get: () => TState
  ) => void;
}

/* =========================================================
 * Service
 * =======================================================*/

export type CrudService<
  CreateDto,
  UpdateDto,
  Filters,
  TListResponse,
  TCreateResponse,
  TUpdateResponse,
  TDeleteResponse = void,
> = {
  getAll(filters?: Filters): Promise<TListResponse>;

  create(payload: CreateDto): Promise<TCreateResponse>;

  update(
    id: number | string,
    payload: UpdateDto
  ): Promise<TUpdateResponse>;

  delete(id: number | string): Promise<TDeleteResponse>;
};

/* =========================================================
 * Options
 * =======================================================*/

export interface CrudOptions<
  T extends Entity,
  CreateDto,
  UpdateDto,
  Filters,
  ListResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse = void,
> {
  service: CrudService<
    CreateDto,
    UpdateDto,
    Filters,
    ListResponse,
    CreateResponse,
    UpdateResponse,
    DeleteResponse
  >;

  initialState?: Partial<CrudState<T>>;

  extractItem(response: CreateResponse): T;

  extractUpdate(response: UpdateResponse): T;

  extractList(response: ListResponse): T[];

  extractPagination?: (
    response: ListResponse
  ) => PaginationMeta;

  messages?: CrudMessages;
}

/* =========================================================
 * Factory
 * =======================================================*/

export function createCrudStore<
  T extends Entity,
  CreateDto,
  UpdateDto,
  Filters,
  TListResponse,
  TCreateResponse,
  TUpdateResponse,
  TDeleteResponse = void,
>(
  options: CrudOptions<
    T,
    CreateDto,
    UpdateDto,
    Filters,
    TListResponse,
    TCreateResponse,
    TUpdateResponse,
    TDeleteResponse
  >
) {
  type Slice = CrudSlice<
    T,
    CreateDto,
    UpdateDto,
    Filters
  >;

  return function createCrudInstance<
    TState extends Slice,
  >(
    set: Parameters<
      FullStoreCreator<TState>
    >[0],

    get: Parameters<
      FullStoreCreator<TState>
    >[1],

    _store: Parameters<
      FullStoreCreator<TState>
    >[2],

    lifecycle?: CrudLifecycle<
      T,
      CreateDto,
      UpdateDto,
      Filters,
      TListResponse,
      TCreateResponse,
      TUpdateResponse,
      TState
    >
  ): Slice {
    const {
      service,
      initialState,
      extractItem,
      extractList,
      extractUpdate,
      extractPagination,
      messages,
    } = options;

    const executeFetch = (
      action: () => Promise<unknown>,
      fallback: string
    ) =>
      createAsyncAction(
        set,
        "isFetching",
        "fetchError"
      )(action, fallback);

    const executeSubmit = (
      action: () => Promise<unknown>,
      fallback: string
    ) =>
      createAsyncAction(
        set,
        "isSubmitting",
        "submitError"
      )(action, fallback);

    const executeDelete = (
      action: () => Promise<unknown>,
      fallback: string
    ) =>
      createAsyncAction(
        set,
        "isDeleting",
        "deleteError"
      )(action, fallback);

    return {
      items: [],
      selectedItem: null,
      selectedIds: [],
      pagination: DEFAULT_PAGINATION,

      isFetching: false,
      isSubmitting: false,
      isDeleting: false,

      fetchError: null,
      submitError: null,
      deleteError: null,

      ...initialState,

      /* =====================================================
       * Fetch
       * ===================================================*/

      async fetch(filters) {
        await executeFetch(
          async () => {
            const response =
              await service.getAll(filters);

            const items =
              extractList(response);

            set((state) => {
              state.items =
                castDraft(items);

              if (extractPagination) {
                state.pagination =
                  extractPagination(response);
              }

              lifecycle?.onFetched?.(
                response,
                items,
                get
              );
            });
          },
          messages?.fetch ??
            "فشل تحميل البيانات"
        );
      },

      /* =====================================================
       * Create
       * ===================================================*/

      async create(payload) {
        let createdItem: T | undefined;

        await executeSubmit(
          async () => {
            const response =
              await service.create(payload);

            const item =
              extractItem(response);

            if (!item) {
              return;
            }

            createdItem = item;

            set((state) => {
              state.items.unshift(
                castDraft(item)
              );

              lifecycle?.onCreated?.(
                item,
                response,
                get
              );
            });
          },
          messages?.create ??
            "فشل الإضافة"
        );

        return createdItem;
      },

      /* =====================================================
       * Update
       * ===================================================*/

      async update(id, payload) {
        let updatedItem: T | undefined;

        await executeSubmit(
          async () => {
            const response =
              await service.update(
                id,
                payload
              );

            const item =
              extractUpdate(response);

            if (!item) {
              return;
            }

            updatedItem = item;

            set((state) => {
              const oldItem = findItemById(state.items, id);

              const index = state.items.findIndex(
                (currentItem) =>
                  String(currentItem.id) === String(id)
              );

              if (index !== -1) {
                state.items[index] = castDraft(item);
              } else {
                state.items.unshift(castDraft(item));
              }

              lifecycle?.onUpdated?.(
                oldItem
                  ? current(oldItem)
                  : undefined,
                item,
                response,
                get
              );
            });
          },
          messages?.update ??
            "فشل التحديث"
        );

        return updatedItem;
      },

      /* =====================================================
       * Delete
       * ===================================================*/

      async delete(id) {
        const currentState = get();

        const previousItems = [
          ...currentState.items,
        ];

        const previousPagination =
          currentState.pagination;

        const previousSelectedIds = [
          ...currentState.selectedIds,
        ];

        const previousSelectedItem =
          currentState.selectedItem;

        const targetItem =
          previousItems.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        set((state) => {
          state.items =
            state.items.filter(
              (item) =>
                String(item.id) !==
                String(id)
            );

          state.selectedIds =
            state.selectedIds.filter(
              (selectedId) =>
                String(selectedId) !==
                String(id)
            );

          if (
            state.selectedItem &&
            String(
              state.selectedItem.id
            ) === String(id)
          ) {
            state.selectedItem = null;
          }

          lifecycle?.onDeleted?.(
            id,
            targetItem,
            get
          );
        });

        try {
          await executeDelete(
            () => service.delete(id),
            messages?.delete ??
              "فشل الحذف"
          );
        } catch (error) {
          set((state) => {
            state.items =
              castDraft(
                previousItems
              );

            state.pagination =
              previousPagination;

            state.selectedIds =
              castDraft(
                previousSelectedIds
              );

            setSelectedItemSafely(
              state,
              previousSelectedItem
            );
          });

          throw error;
        }
      },

      /* =====================================================
       * Selection
       * ===================================================*/

      setSelectedItem(item) {
        set((state) => {
          setSelectedItemSafely(state, item);
        });
      },

      toggleSelectId(id) {
        set((state) => {
          const index =
            state.selectedIds.findIndex(
              (selectedId) =>
                String(selectedId) ===
                String(id)
            );

          if (index !== -1) {
            state.selectedIds.splice(
              index,
              1
            );
          } else {
            state.selectedIds.push(id);
          }
        });
      },

      clearErrors() {
        set((state) => {
          state.fetchError = null;
          state.submitError = null;
          state.deleteError = null;
        });
      },
    };
  };
}

/* =========================================================
 * Helpers
 * =======================================================*/


function findItemById<T extends Entity>(
  items: T[],
  id: number | string,
): T | undefined {
  return items.find(
    (currentItem) =>
      String(currentItem.id) === String(id),
  );
}

function setSelectedItemSafely<T extends Entity>(
  state: {
    selectedItem:
      | (T extends object ? Draft<T> : T)
      | null;
  },
  item: T | null,
): void {
  state.selectedItem =
    item === null
      ? null
      : castDraft(item) as
          T extends object
            ? Draft<T>
            : T;
}