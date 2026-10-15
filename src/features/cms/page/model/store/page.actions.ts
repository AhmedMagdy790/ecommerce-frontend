// src/features/cms/page/model/store/page.actions.ts
import { type Draft } from "immer";
import pageService from "../../api/page.service";
import { createAsyncAction } from "@/shared/store/asyncAction";
import type { Page } from "../types/page.types";
import pageAdapter from "../../adapters/page.adapter";

export interface PageCustomActions {
  isPageLoading: boolean;
  pageError: string | null;
  selectedPage: Page | null;
  getPageById: (id: number | string) => Promise<Page | void>;
}

export const createPageActions = ({
  set,
}: {
  set: (updater: (state: Draft<any>) => void) => void;
  get: () => any;
}): PageCustomActions => ({
  isPageLoading: false,
  pageError: null,
  selectedPage: null,

  getPageById: async (id: number | string) => {
    const executeFetch = createAsyncAction(
      set,
      "isPageLoading",
      "pageError"
    );

    let result: Page | void = undefined;

    await executeFetch(async () => {
      const response = await pageService.getPageById(id);
      // افترضنا أن الـ response يحتوي على البيانات مباشرة أو حسب هيكل الـ SingleResponse
      const pageData = pageAdapter.fromSingleResponse(response);
      
      set((state: Draft<any>) => {
        state.selectedPage = pageData;
      });

      result = pageData;
    }, "فشل تحميل تفاصيل الصفحة");

    return result;
  },
});