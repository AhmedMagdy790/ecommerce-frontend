import { adminApi } from "@/api/client";
import type { 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import type { StoreSectionItemPayload, UpdateSectionItemPayload, ReorderSectionItemsPayload } from "../model/types/sectionItem.types";
import type { SectionItemListResponse, SectionItemSingleResponse } from "../model/types/sectionItem.api";

export const sectionItemServices = {

  getAll(params?: Record<string, any>) {
    const sectionId = params?.section_id;
    if (sectionId) {
      console.log("sectionId", sectionId)
      return adminApi.getSectionItems<SectionItemListResponse>(sectionId, params);
    }
    return adminApi.getSectionItems<SectionItemListResponse>('', params);
  },

  getBySection(sectionId: number | string, params?: Record<string, any>) {
    return adminApi.getSectionItems<SectionItemListResponse>(sectionId, params);
  },

  getById(id: number | string) {
    return adminApi.getSectionItemById<SectionItemSingleResponse>(id);
  },

  create(payload: StoreSectionItemPayload) {
    const sectionId = payload.section_id;
    // إرسال الـ payload مباشرة كـ JSON بدون استخدام createFormData
    return adminApi.createSectionItem<
      SectionItemSingleResponse, 
      StoreSectionItemPayload
    >(
      sectionId || '', 
      payload
    );
  },

  update(id: number | string, payload: UpdateSectionItemPayload) {
    // إذا كان الـ API الخاص بك يتطلب _method: 'PUT' مع الـ JSON يمكنك إضافتها هكذا، أو استخدام الـ method المناسبة في الapi client
    const requestPayload = {
      ...payload,
      _method: "PUT",
    };

    // إرسال الـ payload مباشرة كـ JSON بدون FormData
    return adminApi.patchSectionItem<
      SectionItemSingleResponse
    >(
      id,
      requestPayload
    );
  },

  reorder(sectionId: number | string, payload: ReorderSectionItemsPayload) {
    return adminApi.reorderSectionItems<SuccessApiResponse<null>, ReorderSectionItemsPayload>(
      sectionId,
      payload
    );
  },

  delete(id: number | string) {
    return adminApi.deleteSectionItem<SuccessApiResponse<null>>(id);
  },
};

export default sectionItemServices;