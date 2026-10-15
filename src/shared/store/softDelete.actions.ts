// src/shared/store/softDelete.actions.ts

import { type StateCreator } from "zustand";
import { castDraft, type Draft } from "immer";

import { createAsyncAction } from "./asyncAction";
import {
  decrementTotal,
  incrementTotal,
} from "./crud.helpers";

import type { PaginationMeta } from "../types/api.types";
import type { Entity } from "./crud.actions";

/* =========================================================
 * Types
 * =======================================================*/

export interface SoftDeleteMessages {
  fetchTrashed?: string;
  trash?: string;
  restore?: string;
  forceDelete?: string;
}

/**
 * الحالة التي يحتاجها Soft Delete من الـ Store المدمج.
 *
 * items و pagination اختياريان لأن Soft Delete يمكن استخدامه
 * مع Store لا يحتوي على CRUD كامل.
 */
export type SoftDeleteStoreState<T extends Entity> =
  SoftDeleteState<T> &
  SoftDeleteActions<unknown> & {
    items?: T[];
    pagination?: PaginationMeta;
  };

/* =========================================================
 * State
 * =======================================================*/

export interface SoftDeleteState<T extends Entity> {
  trashedItems: T[];

  isFetchingTrashed: boolean;
  isTrashActionLoading: boolean;

  fetchTrashedError: string | null;
  trashActionError: string | null;
}

/* =========================================================
 * Actions
 * =======================================================*/

export interface SoftDeleteActions<Filters> {
  fetchTrashed(filters?: Filters): Promise<void>;

  trash(id: number | string): Promise<void>;

  restore(id: number | string): Promise<void>;

  forceDelete(id: number | string): Promise<void>;

  clearSoftDeleteErrors(): void;
}

/* =========================================================
 * Service
 * =======================================================*/

export type SoftDeleteService<
  Filters,
  ListResponse,
  TrashResponse = void,
  RestoreResponse = void,
  ForceDeleteResponse = void,
> = {
  getTrashed?(filters?: Filters): Promise<ListResponse>;

  trash?(id: number | string): Promise<TrashResponse>;

  restore?(id: number | string): Promise<RestoreResponse>;

  forceDelete?(
    id: number | string
  ): Promise<ForceDeleteResponse>;
};

/* =========================================================
 * Options
 * =======================================================*/

export interface SoftDeleteOptions<
  T extends Entity,
  Filters,
  ListResponse,
  TrashResponse = void,
  RestoreResponse = void,
  ForceDeleteResponse = void,
  TState extends
    SoftDeleteState<T> &
    SoftDeleteActions<Filters> &
    {
      items?: T[];
      pagination?: PaginationMeta;
    } =
    SoftDeleteState<T> &
    SoftDeleteActions<Filters> &
    {
      items?: T[];
      pagination?: PaginationMeta;
    },
> {
  service: SoftDeleteService<
    Filters,
    ListResponse,
    TrashResponse,
    RestoreResponse,
    ForceDeleteResponse
  >;

  initialState?: Partial<SoftDeleteState<T>>;

  extractList(response: ListResponse): T[];

  extractPagination?: (
    response: ListResponse
  ) => PaginationMeta;

  onFetchedTrashed?: (
    response: ListResponse,
    items: T[],
    state: Draft<TState>,
    get: () => TState
  ) => void;

  onTrashed?: (
    item: T,
    response: TrashResponse,
    state: Draft<TState>,
    get: () => TState
  ) => void;

  onRestored?: (
    item: T,
    response: RestoreResponse,
    state: Draft<TState>,
    get: () => TState
  ) => void;

  onForceDeleted?: (
    id: number | string,
    item: T | undefined,
    response: ForceDeleteResponse,
    state: Draft<TState>,
    get: () => TState
  ) => void;

  messages?: SoftDeleteMessages;
}

/* =========================================================
 * Full Store Creator
 * =======================================================*/

type FullStoreCreator<TState> = StateCreator<
  TState,
  [
    ["zustand/devtools", never],
    ["zustand/immer", never],
  ],
  [],
  TState
>;

/* =========================================================
 * Store Factory
 * =======================================================*/

export function createSoftDeleteStore<
  T extends Entity,
  Filters,
  ListResponse,
  TrashResponse = void,
  RestoreResponse = void,
  ForceDeleteResponse = void,
>(
  options: SoftDeleteOptions<
    T,
    Filters,
    ListResponse,
    TrashResponse,
    RestoreResponse,
    ForceDeleteResponse
  >
) {
  type Slice =
    SoftDeleteState<T> &
    SoftDeleteActions<Filters>;

  return function createSoftDeleteInstance<
    TState extends
      Slice &
      {
        items?: T[];
        pagination?: PaginationMeta;
      },
  >(
    set: Parameters<FullStoreCreator<TState>>[0],
    get: Parameters<FullStoreCreator<TState>>[1],
  ): Slice {
    const {
      service,
      initialState,
      extractList,
      extractPagination,
      onFetchedTrashed,
      onTrashed,
      onRestored,
      onForceDeleted,
      messages,
    } = options;

    /* =====================================================
     * Async Helpers
     * ===================================================*/

    const executeFetch = (
      action: () => Promise<unknown>,
      fallback: string
    ) =>
      createAsyncAction(
        set,
        "isFetchingTrashed",
        "fetchTrashedError"
      )(action, fallback);

    const executeAction = (
      action: () => Promise<unknown>,
      fallback: string
    ) =>
      createAsyncAction(
        set,
        "isTrashActionLoading",
        "trashActionError"
      )(action, fallback);

    /* =====================================================
     * Store
     * ===================================================*/

    return {
      /* ---------------------------------------------------
       * Initial State
       * -------------------------------------------------*/

      trashedItems: [],
      isFetchingTrashed: false,
      isTrashActionLoading: false,
      fetchTrashedError: null,
      trashActionError: null,

      ...initialState,

      /* ---------------------------------------------------
       * Fetch Trashed
       * -------------------------------------------------*/

      async fetchTrashed(filters) {
        await executeFetch(
          async () => {
            const getTrashedFn =
              service.getTrashed;

            if (!getTrashedFn) {
              return;
            }

            const response =
              await getTrashedFn(filters);

            const items =
              extractList(response);

            set((state) => {
              state.trashedItems =
                castDraft(items);

              onFetchedTrashed?.(
                response,
                items,
                state,
                get
              );

              if (extractPagination) {
                state.pagination =
                  extractPagination(response);
              }
            });
          },
          messages?.fetchTrashed ??
            "فشل تحميل العناصر المحذوفة"
        );
      },

      /* ---------------------------------------------------
       * Trash
       * -------------------------------------------------*/

      async trash(id) {
        const currentState = get();

        const targetItem =
          currentState.items?.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        await executeAction(
          async () => {
            const trashFn =
              service.trash;

            if (!trashFn) {
              return;
            }

            const response =
              await trashFn(id);

            set((state) => {
              if (state.items) {
                state.items =
                  state.items.filter(
                    (item) =>
                      String(item.id) !==
                      String(id)
                  );
              }

              if (targetItem) {
                if (state.pagination) {
                  state.pagination =
                    decrementTotal(
                      state.pagination
                    );
                }

                state.trashedItems.unshift(
                  castDraft(targetItem)
                );

                onTrashed?.(
                  targetItem,
                  response,
                  state,
                  get
                );
              }
            });
          },
          messages?.trash ??
            "فشل نقل العنصر إلى سلة المهملات"
        );
      },

      /* ---------------------------------------------------
       * Restore
       * -------------------------------------------------*/

      async restore(id) {
        const currentState = get();

        const targetItem =
          currentState.trashedItems.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        await executeAction(
          async () => {
            const restoreFn =
              service.restore;

            if (!restoreFn) {
              return;
            }

            const response =
              await restoreFn(id);

            set((state) => {
              state.trashedItems =
                state.trashedItems.filter(
                  (item) =>
                    String(item.id) !==
                    String(id)
                );

              if (targetItem) {
                if (state.items) {
                  state.items.unshift(
                    castDraft(targetItem)
                  );
                }

                if (state.pagination) {
                  state.pagination =
                    incrementTotal(
                      state.pagination
                    );
                }

                onRestored?.(
                  targetItem,
                  response,
                  state,
                  get
                );
              }
            });
          },
          messages?.restore ??
            "فشل استعادة العنصر"
        );
      },

      /* ---------------------------------------------------
       * Force Delete
       * -------------------------------------------------*/

     async forceDelete(id) {
        const currentState = get();

        // 🟢 البحث عن العنصر في trashedItems قبل حذفه للحصول على الـ previousItem
        const targetItem =
          currentState.trashedItems.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        await executeAction(
          async () => {
            const forceDeleteFn =
              service.forceDelete;

            if (!forceDeleteFn) {
              return;
            }

            const response =
              await forceDeleteFn(id);

            set((state) => {
              state.trashedItems =
                state.trashedItems.filter(
                  (item) =>
                    String(item.id) !==
                    String(id)
                );

              // 🟢 تمرير الـ id والـ targetItem للـ callback
              onForceDeleted?.(
                id,
                targetItem, // <-- تمرير الكائن السابق هنا
                response,
                state,
                get
              );
            });
          },
          messages?.forceDelete ??
            "فشل الحذف النهائي للعنصر"
        );
      },

      /* ---------------------------------------------------
       * Errors
       * -------------------------------------------------*/

      clearSoftDeleteErrors() {
        set((state) => {
          state.fetchTrashedError = null;
          state.trashActionError = null;
        });
      },
    };
  };
}
