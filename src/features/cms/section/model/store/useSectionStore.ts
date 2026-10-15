import { createFeatureStore } from "@/shared/store/createFeatureStore";
import sectionServices from "../../api/section.service";
import { sectionAdapter } from "../../adapters/section.adapter";
import type { Section, SectionFilters } from "../types/section.types";
import type { CreateSectionDto, UpdateSectionDto } from "../types/section.dto";
import type { 
  SectionDeleteResponse, 
  SectionListResponse, 
  SectionSingleResponse 
} from "../types/section.api";
import { DEFAULT_SECTION_FILTERS } from "../../dashboard/constants/section.constants";
import type { TranslatedText } from "@/shared/types/types";

export const useSectionStore = createFeatureStore<
  Section<TranslatedText>,                        // TModel
  CreateSectionDto,               // TCreateDto
  UpdateSectionDto,               // TUpdateDto
  SectionFilters,                 // TFilters
  SectionListResponse,            // TListRes
  SectionSingleResponse,          // TSingleRes
  SectionDeleteResponse,          // TDeleteRes
  SectionSingleResponse,          // TUpdateRes (افتراضي غالباً Single)
  SectionListResponse,            // TTrashRes
  SectionSingleResponse,          // TRestoreRes
  SectionDeleteResponse,          // TForceDeleteRes
  Record<string, never>,
  boolean                         // TStats
>({
  name: "SectionStore",

  service: sectionServices,

  adapter: sectionAdapter,

  defaultFilters: DEFAULT_SECTION_FILTERS,

  defaultSortBy: "created_at",

  toggle: {
    extractItem: sectionAdapter.fromToggleResponse, // أو من الـ Single Response
    getStatus: (item) => item.is_active ?? false,
    getNextStatus: (currentStatus) => !currentStatus,
    setStatus: (item, status) => ({
      ...item,
      is_active: status,
    }),
    errorMessage: "فشل تغيير حالة القسم",
  },
});