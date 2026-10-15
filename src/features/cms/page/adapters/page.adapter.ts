// src/features/cms/page/adapters/page.adapter.ts
import type { PaginatedApiResponse, PaginationMeta } from "@/shared/types/api.types";
import type { Page, PageStats } from "../model/types/page.types";
import type { CreatePageDto, UpdatePageDto } from "../model/types/page.dto";
import type { PageFormData } from "../model/schema/pageSchema"; 
import type { PageListResponse, PageSingleResponse } from "../model/types/page.api";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { TranslatedText } from "@/shared/types/types";

export const pageAdapter = {
  fromListResponse(response: PaginatedApiResponse<Page<TranslatedText>>): Page<TranslatedText>[] {
    return response.data.items;
  },

  fromCreateResponse(response: PageSingleResponse): Page<TranslatedText> {
    return response.data.page;
  },

  fromUpdateResponse(response: PageSingleResponse): Page<TranslatedText> {
    return response.data.page;
  },

  fromToggleResponse(response: PageSingleResponse): Page<TranslatedText> {
    return response.data.page;
  },

  fromSingleResponse(response: PageSingleResponse): Page<TranslatedText> {
    return response.data.page;
  },

  extractPagination(response: PaginatedApiResponse<Page<TranslatedText>>): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  extractStats(response: PageListResponse): PageStats {
    return extractStatsSafely(response?.data?.stats, {
      total: 0,
      active: 0,
      inactive: 0,
    });
  },

  toCreateDto(formData: PageFormData): CreatePageDto {
    return {
      title: formData.title,
      slug: formData.slug,
      content: formData.content || null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      is_active: formData.is_active ?? true,
    };
  },

  toUpdateDto(formData: PageFormData): UpdatePageDto {
    return {
      title: formData.title,
      slug: formData.slug,
      content: formData.content || null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      is_active: formData.is_active,
    };
  }
};

export default pageAdapter;