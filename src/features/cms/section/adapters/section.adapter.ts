import type { PaginationMeta } from "@/shared/types/api.types";
import type { Section } from "../model/types/section.types";
import type { CreateSectionDto, UpdateSectionDto } from "../model/types/section.dto";
import type { SectionFormData } from "../model/schema/sectionSchema";
import type { SectionListResponse, SectionSingleResponse } from "../model/types/section.api";
import type { TranslatedText } from "@/shared/types/types";

export const sectionAdapter = {
  fromListResponse(response: SectionListResponse): Section<TranslatedText>[] {
    return response.data.items;
  },

  fromCreateResponse(response: SectionSingleResponse): Section<TranslatedText> {
    return response.data.section;
  },

  fromToggleResponse(response: SectionSingleResponse): Section<TranslatedText> {
    return response.data.section;
  },

  fromSingleResponse(response: SectionSingleResponse): Section<TranslatedText> {
    return response.data.section;
  },

  fromUpdateResponse(response: SectionSingleResponse): Section<TranslatedText> {
    return response.data.section;
  },

  extractPagination(response: SectionListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  toCreateDto(formData: SectionFormData): CreateSectionDto {
    return {
      page_id: formData.page_id,
      name: formData.name,
      key: formData.key,
      type: formData.type,
      sort_order: formData.sort_order ?? 0,
      is_active: formData.is_active ?? true,
      settings: formData.settings || null,
      selected_ids: formData.selected_ids || [],
    };
  },

  toUpdateDto(formData: SectionFormData): UpdateSectionDto {
    return {
      page_id: formData.page_id,
      name: formData.name,
      key: formData.key,
      type: formData.type,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
      settings: formData.settings || null,
      selected_ids: formData.selected_ids || [],
    };
  }
};