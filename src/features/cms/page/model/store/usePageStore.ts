// src/features/cms/page/model/store/page.store.ts
import { createFeatureStore } from "@/shared/store/createFeatureStore";
import type { Page, PageFilters } from "../types/page.types";
import type { CreatePageDto, UpdatePageDto } from "../types/page.dto";
import type { PageListResponse, PageSingleResponse, PageDeleteResponse } from "../types/page.api";
import pageService from "../../api/page.service";
import pageAdapter from "../../adapters/page.adapter";
import { DEFAULT_PAGE_FILTERS } from "../../constants/page.constants";
import { PageStatsHooks } from "./pageStatsStore";
import { createPageActions, type PageCustomActions } from "./page.actions";
import type { TranslatedText } from "@/shared/types/types";

export type IPageState = ReturnType<typeof createFeatureStore<
  Page<TranslatedText>,
  CreatePageDto,
  UpdatePageDto,
  PageFilters,
  PageListResponse,
  PageSingleResponse,
  PageDeleteResponse,
  PageSingleResponse,
  PageListResponse,
  PageSingleResponse,
  PageDeleteResponse,
  PageCustomActions,
  boolean
>>;

export const usePageStore = createFeatureStore<
  Page<TranslatedText>,                  // TModel
  CreatePageDto,         // TCreateDto
  UpdatePageDto,         // TUpdateDto
  PageFilters,           // TFilters
  PageListResponse,      // TListRes
  PageSingleResponse,    // TSingleRes
  PageDeleteResponse,    // TDeleteRes
  PageSingleResponse,    // TUpdateRes
  PageListResponse,      // TTrashRes
  PageSingleResponse,    // TRestoreRes
  PageDeleteResponse,    // TForceDeleteRes
  PageCustomActions,     // TCustomState
  boolean                // TStats
>({
  name: "PageStore",

  service: pageService,

  adapter: pageAdapter,

  defaultFilters: DEFAULT_PAGE_FILTERS,

  defaultSortBy: "created_at",

  customActions: ({ set, get }) => ({
    ...createPageActions({ set, get }),
  }),

  toggle: {
    extractItem: pageAdapter.fromToggleResponse,
    getStatus: (item) => item.is_active,
    getNextStatus: (currentStatus) => !currentStatus,
    setStatus: (item, status) => ({
      ...item,
      is_active: status,
    }),
    onChanged: PageStatsHooks.onToggled,
    errorMessage: "فشل تغيير حالة الصفحة",
  },

  hooks: {
    onFetched: (response) => {
      PageStatsHooks.onFetched(response.data?.stats);
    },
    onCreated: (item) => {
      PageStatsHooks.onCreated(item);
    },
    onDeleted: (id, previousItem) => {
      PageStatsHooks.onDeleted(id, previousItem);
    },
  },

});