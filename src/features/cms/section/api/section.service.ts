// src/features/cms/section/api/section.service.ts
import { adminApi } from "@/api/client";
import type { 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import { createFormData } from "@/shared/utils/api-helpers";
import type { CreateSectionDto, UpdateSectionDto } from "../model/types/section.dto";
import { type SectionListResponse, type SectionSingleResponse } from "../model/types/section.api";

export const sectionServices = {

  getAll(params?: Record<string, any>) {
    return adminApi.getSections<SectionListResponse>(params);
  },

  getSectionById(id: number | string) {
    return adminApi.getSectionById<SectionSingleResponse>(id);
  },

  create(payload: CreateSectionDto) {
    return adminApi.createSection<SectionSingleResponse, FormData>(
      createFormData(payload)
    );
  },

  update(id: number | string, payload: UpdateSectionDto) {

    const formData = createFormData(payload);
    formData.append("_method", "PUT");

    return adminApi.patchSection<
     SectionSingleResponse,
      FormData
    >(
      id,
      formData
    );
  },

  toggleStatus(id: number | string) {
    return adminApi.toggleSectionStatus<SectionSingleResponse>(id);
  },

  delete(id: number | string) {
    return adminApi.deleteSection<SuccessApiResponse<null>>(id);
  },
};

export default sectionServices;