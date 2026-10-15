import type { PaginationMeta } from "@/shared/types/api.types";
import type { SectionItem, StoreSectionItemPayload, UpdateSectionItemPayload } from "../model/types/sectionItem.types";
import type { SectionItemFormData } from "../model/schema/sectionItemSchema";
import type { SectionItemListResponse, SectionItemSingleResponse } from "../model/types/sectionItem.api";
import type { TranslatedText } from "@/shared/types/types";

export const sectionItemAdapter = {
  fromListResponse(response: SectionItemListResponse): SectionItem<TranslatedText>[] {
    return response.data.items;
  },

  fromSingleResponse(response: SectionItemSingleResponse): SectionItem<TranslatedText> {
    return response.data.item;
  },
  
  extractPagination(response: SectionItemListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  fromCreateResponse(response: SectionItemSingleResponse): SectionItem<TranslatedText> {
    return response.data.item;
  },

  fromUpdateResponse(response: SectionItemSingleResponse): SectionItem<TranslatedText> {
    return response.data.item;
  },

  toCreateDto(formData: SectionItemFormData): StoreSectionItemPayload {
    return {
      section_id: formData.section_id,
      product_id: formData.product_id || null,
      title: formData.title,
      subtitle: formData.subtitle || null,
      description: formData.description || null, // Added missing field
      image: formData.image || null,
      link: formData.link || null,
      button_text: formData.button_text || null, // Added missing field
      action_text: formData.action_text || null, // Added missing field
      float_title: formData.float_title || null, // Added missing field
      float_subtitle: formData.float_subtitle || null, // Added missing field
      stat_number: formData.stat_number || null, // Added missing field
      stat_text: formData.stat_text || null, // Added missing field
      sort_order: formData.sort_order ?? 0,
      data: formData.data || {}, // Fallback to empty object matching z.record
    };
  },

  toUpdateDto(formData: SectionItemFormData): UpdateSectionItemPayload {
    return {
      section_id: formData.section_id,
      product_id: formData.product_id || null,
      title: formData.title,
      subtitle: formData.subtitle || null,
      description: formData.description || null, // Added missing field
      image: formData.image || null,
      link: formData.link || null,
      button_text: formData.button_text || null, // Added missing field
      action_text: formData.action_text || null, // Added missing field
      float_title: formData.float_title || null, // Added missing field
      float_subtitle: formData.float_subtitle || null, // Added missing field
      stat_number: formData.stat_number || null, // Added missing field
      stat_text: formData.stat_text || null, // Added missing field
      sort_order: formData.sort_order ?? 0,
      data: formData.data || {}, // Fallback to empty object matching z.record
    };
  },
};