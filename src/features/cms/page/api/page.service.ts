// src/features/cms/page/api/page.service.ts
import { adminApi } from "@/api/client";
import type { 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import { createFormData } from "@/shared/utils/api-helpers";
import type { Page } from "../model/types/page.types";
import type { CreatePageDto, UpdatePageDto } from "../model/types/page.dto";
import type { PageListResponse } from "../model/types/page.api";
import type { TranslatedText } from "@/shared/types/types";

export const pageServices = {

  getAll(params?: Record<string, any>) {
    return adminApi.getPages<PageListResponse>(params);
  },

  getPageById(id: number | string) {
    return adminApi.getPageById<SuccessApiResponse<{ page: Page<TranslatedText> }>>(id);
  },

  // إضافة هذا المرادف ليتوافق تماماً مع توقعات createCrudStore
  getById(id: number | string) {
    return this.getPageById(id);
  },

  create(payload: CreatePageDto) {
    return adminApi.createPage<SuccessApiResponse<{ page: Page<TranslatedText> }>, FormData>(
      createFormData(payload)
    );
  },

  update(id: number | string, payload: UpdatePageDto) {
    const formData = createFormData(payload);
    formData.append("_method", "PUT");

    return adminApi.patchPage<
      SuccessApiResponse<{ page: Page<TranslatedText> }>,
      FormData
    >(
      id,
      formData
    );
  },

  toggleStatus(id: number | string) {
    return adminApi.togglePageStatus<SuccessApiResponse<{ page: Page<TranslatedText> }>>(id);
  },

  delete(id: number | string) {
    return adminApi.deletePage<SuccessApiResponse<null>>(id);
  },
};

export default pageServices;