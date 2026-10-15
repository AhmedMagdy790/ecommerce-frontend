// src/shared/store/createFeatureStore.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import {
  createCrudStore,
  type CrudActions,
  type CrudState,
} from "@/shared/store/crud.actions";

import {
  createSoftDeleteStore,
  type SoftDeleteActions,
  type SoftDeleteState,
} from "@/shared/store/softDelete.actions";

import {
  createTableStore,
  type TableSlice,
} from "@/shared/store/createTableStore";

import type { CustomActionsCreator } from "@/shared/store/createCustomActions";

import type { ApiAdapters } from "@/shared/store/adapter.actions";

import {
  createToggleStore,
  type ToggleState,
  type EntityId,
} from "@/shared/store/createToggleStore";

/* =========================================================
 * Base
 * =======================================================*/

export interface BaseEntity {
  id: EntityId;
}

/* =========================================================
 * Combined State
 * =======================================================*/

export type CombinedFeatureState<
  TModel extends BaseEntity,
  TCreateDto,
  TUpdateDto,
  TFilters extends Record<string, unknown>,
> = CrudState<TModel> &
  CrudActions<TModel, TCreateDto, TUpdateDto, TFilters> &
  SoftDeleteState<TModel> &
  SoftDeleteActions<TFilters> &
  TableSlice<TFilters> &
  ToggleState;

/* =========================================================
 * Service
 * =======================================================*/

interface FeatureStoreService<
  TCreateDto,
  TUpdateDto,
  TFilters,
  TListRes,
  TSingleRes,
  TDeleteRes,
  TUpdateRes,
  TTrashRes,
  TRestoreRes,
  TForceDeleteRes,
> {
  getAll(filters?: TFilters): Promise<TListRes>;

  get?(id: EntityId): Promise<TSingleRes>;

  create(dto: TCreateDto): Promise<TSingleRes>;

  update(id: EntityId, dto: TUpdateDto): Promise<TUpdateRes>;

  delete(id: EntityId): Promise<TDeleteRes>;

  getTrashed?(filters?: TFilters): Promise<TListRes>;

  trash?(id: EntityId): Promise<TTrashRes>;

  restore?(id: EntityId): Promise<TRestoreRes>;

  forceDelete?(id: EntityId): Promise<TForceDeleteRes>;

  toggleStatus?(id: EntityId): Promise<TSingleRes>;
}

/* =========================================================
 * Config
 * =======================================================*/

interface FeatureStoreConfig<
  TModel extends BaseEntity,
  TCreateDto,
  TUpdateDto,
  TFilters extends Record<string, unknown>,
  TListRes,
  TSingleRes,
  TDeleteRes,
  TUpdateRes,
  TTrashRes,
  TRestoreRes,
  TForceDeleteRes,
  TCustomState extends object = Record<string, never>,
  TToggleStatus = boolean,
> {
  name: string;

  service: FeatureStoreService<
    TCreateDto,
    TUpdateDto,
    TFilters,
    TListRes,
    TSingleRes,
    TDeleteRes,
    TUpdateRes,
    TTrashRes,
    TRestoreRes,
    TForceDeleteRes
  >;

  adapter: ApiAdapters<TModel, TListRes, TSingleRes, TUpdateRes>;

  defaultFilters: TFilters;

  defaultSortBy?: string;

  customActions?: CustomActionsCreator<
    CombinedFeatureState<TModel, TCreateDto, TUpdateDto, TFilters> &
      TCustomState,
    TCustomState
  >;

  /* =======================================================
   * Hooks (مدمجة بالكامل لجميع العمليات: CRUD + SoftDelete)
   * =====================================================*/
  hooks?: {
    onFetched?: (response: TListRes) => void;
    onCreated?: (item: TModel, response: TSingleRes) => void;
    onUpdated?: (item: TModel, response: TUpdateRes) => void;
    
    onDeleted?: (id: EntityId, previousItem?: TModel) => void;

    onTrashed?: (id: EntityId, previousItem?: TModel) => void;
    onRestored?: (item: TModel) => void;
    onForceDeleted?: (id: EntityId, previousItem?: TModel) => void;
  };

  toggle?: {
    extractItem: (response: TSingleRes) => TModel;
    getStatus: (item: TModel) => TToggleStatus;
    getNextStatus: (current: TToggleStatus) => TToggleStatus;
    setStatus: (item: TModel, status: TToggleStatus) => TModel;
    onChanged?: (item: TModel, status: TToggleStatus) => void;
    errorMessage?: string;
  };
}

/* =========================================================
 * Factory
 * =======================================================*/

export function createFeatureStore<
  TModel extends BaseEntity,
  TCreateDto,
  TUpdateDto,
  TFilters extends Record<string, unknown>,
  TListRes,
  TSingleRes,
  TDeleteRes,
  TUpdateRes = TSingleRes,
  TTrashRes = void,
  TRestoreRes = void,
  TForceDeleteRes = void,
  TCustomState extends object = Record<string, never>,
  TToggleStatus = boolean,
>(
  config: FeatureStoreConfig<
    TModel,
    TCreateDto,
    TUpdateDto,
    TFilters,
    TListRes,
    TSingleRes,
    TDeleteRes,
    TUpdateRes,
    TTrashRes,
    TRestoreRes,
    TForceDeleteRes,
    TCustomState,
    TToggleStatus
  >,
) {
  type FeatureState = CombinedFeatureState<
    TModel,
    TCreateDto,
    TUpdateDto,
    TFilters
  > &
    TCustomState;

  return create<FeatureState>()(
    devtools(
      immer((set, get, store) => {
        /* =================================================
         * CRUD
         * ===============================================*/

        const crudCreator = createCrudStore({
          service: config.service,

          extractItem: config.adapter.fromCreateResponse,

          extractUpdate: config.adapter.fromUpdateResponse,

          extractList: config.adapter.fromListResponse,

          extractPagination: config.adapter.extractPagination,

          messages: {
            fetch: "فشل تحميل البيانات",
            create: "فشل الإضافة",
            update: "فشل التحديث",
            delete: "فشل الحذف",
          },
        });

        /* =================================================
         * SOFT DELETE
         * ===============================================*/

        const softDeleteCreator = createSoftDeleteStore({
          service: {
            getTrashed: async (filters: TFilters | undefined) => {
              const activeFilters = filters ?? config.defaultFilters;

              if (config.service.getTrashed) {
                return config.service.getTrashed(activeFilters);
              }

              return config.service.getAll(activeFilters);
            },

            trash: config.service.trash,

            restore: config.service.restore,

            forceDelete: config.service.forceDelete,
          },

          extractList: config.adapter.fromListResponse,

          // 🟢 استقبال المعاملات الضرورية فقط وتجاهل البقية تماماً
          onTrashed: (item) => {
            config.hooks?.onTrashed?.(item.id, item);
          },

          onRestored: (item) => {
            config.hooks?.onRestored?.(item);
          },

          onForceDeleted: (id, previousItem) => {
            config.hooks?.onForceDeleted?.(id, previousItem);
          },
        });

        /* =================================================
         * TABLE
         * ===============================================*/

        const tableCreator = createTableStore<TFilters, FeatureState>({
          defaultPerPage: 10,

          defaultSortBy: config.defaultSortBy ?? "createdAt",

          defaultFilters: config.defaultFilters,
        });

        /* =================================================
         * CRUD Slice
         * ===============================================*/

        const crudSlice = crudCreator(set, get, store, {
          onFetched: (response) => {
            config.hooks?.onFetched?.(response);
          },

          onCreated: (item, response) => {
            config.hooks?.onCreated?.(item, response);
          },

          onUpdated: (_oldItem, newItem, response) => {
            config.hooks?.onUpdated?.(newItem, response);
          },

          onDeleted: (id, previousItem) => {

            config.hooks?.onDeleted?.(id, previousItem);
          },
        });

        /* =================================================
         * Soft Delete Slice
         * ===============================================*/

        const softDeleteSlice = softDeleteCreator(set, get);

        /* =================================================
         * Table Slice
         * ===============================================*/

        const tableSlice = tableCreator(set, get, store);

        /* =================================================
         * Toggle Slice
         * ===============================================*/

        const toggleInstance =
          config.toggle && config.service.toggleStatus
            ? createToggleStore<
                TModel,
                TSingleRes,
                TToggleStatus,
                FeatureState
              >({
                service: {
                  toggleStatus: config.service.toggleStatus,
                },

                extractItem: config.toggle.extractItem,

                getStatus: config.toggle.getStatus,

                getNextStatus: config.toggle.getNextStatus,

                setStatus: config.toggle.setStatus,

                onChanged: config.toggle.onChanged,

                errorMessage: config.toggle.errorMessage,
              })(set, get, store)
            : ({} as ToggleState);

        /* =================================================
         * Custom Actions
         * ===============================================*/

        const customActions =
          config.customActions?.({
            set,
            get,
          }) ?? ({} as TCustomState);

        /* =================================================
         * Combined State
         * ===============================================*/

        return {
          ...crudSlice,
          ...softDeleteSlice,
          ...tableSlice,
          ...toggleInstance,
          ...customActions,
        };
      }),

      {
        name: config.name,
      },
    ),
  );
}
