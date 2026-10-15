import type { SectionFilters } from "../../model/types/section.types";


export const DEFAULT_SECTION_FILTERS: SectionFilters = {
  search: "",
  is_active: "",
  type: "",
  page_id: undefined,
  page: 1,
  per_page: 20,
  sort_by: "created_at",
  sort_order: "desc",
};