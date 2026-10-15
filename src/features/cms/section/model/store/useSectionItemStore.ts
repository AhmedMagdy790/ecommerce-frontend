import { createFeatureStore } from "@/shared/store/createFeatureStore";
import type { SectionItem, StoreSectionItemPayload, UpdateSectionItemPayload } from "../types/sectionItem.types";
import type { SectionItemListResponse, SectionItemSingleResponse, SectionItemDeleteResponse } from "../types/sectionItem.api";
import sectionItemServices from "../../api/sectionItem.service";
import { sectionItemAdapter } from "../../adapters/sectionItem.adapter";
import type { PaginationFilters } from "@/shared/types/pagination";
import { createSectionItemActions, type SectionItemCustomActions } from "./sectionItem.actions";
import type { TranslatedText } from "@/shared/types/types";

export type ISectionItemState = ReturnType<typeof createFeatureStore<
  SectionItem<TranslatedText>,
  StoreSectionItemPayload,
  UpdateSectionItemPayload,
  PaginationFilters,
  SectionItemListResponse,
  SectionItemSingleResponse,
  SectionItemDeleteResponse,
  SectionItemSingleResponse,
  SectionItemListResponse,
  SectionItemSingleResponse,
  SectionItemDeleteResponse,
  SectionItemCustomActions,
  boolean
>>;

export const useSectionItemStore = createFeatureStore<
  SectionItem<TranslatedText>,                // TModel
  StoreSectionItemPayload,    // TCreateDto
  UpdateSectionItemPayload,   // TUpdateDto
  PaginationFilters,          // TFilters
  SectionItemListResponse,    // TListRes
  SectionItemSingleResponse,  // TSingleRes
  SectionItemDeleteResponse,  // TDeleteRes
  SectionItemSingleResponse,  // TUpdateRes
  SectionItemListResponse,    // TTrashRes
  SectionItemSingleResponse,  // TRestoreRes
  SectionItemDeleteResponse,  // TForceDeleteRes
  SectionItemCustomActions,   // TCustomState
  boolean                     // TStats
>({
  name: "SectionItemStore",

  service: sectionItemServices,

  adapter: sectionItemAdapter,

  defaultFilters: {},

  defaultSortBy: "sort_order",

  customActions: ({ set, get }) => ({
    ...createSectionItemActions({ set, get }),
  }),

  toggle: {
    extractItem: sectionItemAdapter.fromSingleResponse,
    getStatus: (item) => item.is_active ?? false,
    getNextStatus: (currentStatus) => !currentStatus,
    setStatus: (item, status) => ({
      ...item,
      is_active: status,
    }),
    errorMessage: "فشل تغيير حالة العنصر",
  },
});