// src/features/cms/sectionItem/model/store/sectionItem.actions.ts
import { type Draft } from "immer";
import sectionItemServices from "../../api/sectionItem.service";
import { createAsyncAction } from "@/shared/store/asyncAction";
import type { SectionItem } from "../types/sectionItem.types";

export interface SectionItemCustomActions {
  isReordering: boolean;
  reorderError: string | null;
  isFetchingItems: boolean;
  fetchItemsError: string | null;
  // sectionItems: SectionItem[];
  
  reorderItems: (sectionId: number | string, items: number[]) => Promise<void>;
  getBySection: (sectionId: number | string) => Promise<SectionItem[] | void>;
}

export const createSectionItemActions = ({
  set,
}: {
  set: (updater: (state: Draft<any>) => void) => void;
  get: () => any;
}): SectionItemCustomActions => ({
  isReordering: false,
  reorderError: null,
  isFetchingItems: false,
  fetchItemsError: null,
  // sectionItems: [],

  reorderItems: async (sectionId: number | string, items: number[]) => {
    const executeReorder = createAsyncAction(
      set,
      "isReordering",
      "reorderError"
    );

    await executeReorder(async () => {
      await sectionItemServices.reorder(sectionId, { items });
    }, "فشل إعادة ترتيب العناصر");
  },

  getBySection: async (sectionId: number | string) => {
    const executeFetch = createAsyncAction(
      set,
      "isFetchingItems",
      "fetchItemsError"
    );

    let result: SectionItem[] | void = undefined;

    await executeFetch(async () => {
      const response = await sectionItemServices.getBySection(sectionId);
      // التعامل مع هيكل الاستجابة سواء كانت داخل data مباشرة أو paginated
      const items = response.data?.items ?? response.data ?? [];

      set((state: Draft<any>) => {
        state.items = items;
      });

      result = items;
    }, "فشل تحميل عناصر القسم");

    return result;
  },
});