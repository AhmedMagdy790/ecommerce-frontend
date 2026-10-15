import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { SectionFilters } from "../../model/types/section.types";


export const getSectionFilters = (
    t: TFunction,
    _lang: string
): FilterField<SectionFilters>[] => [
    {
      key: "search", // استبدال name بـ key
      label: t("section.searchLabel", "Search"),
      type: "text" as const,
      placeholder: t("section.searchPlaceholder", "Search sections by name or key..."),
    },
    {
      key: "type",
      label: t("section.typeLabel", "Type"),
      type: "select" as const,
      placeholder: t("section.filterByType", "Filter by Type"),
      options: [
        { label: "Hero", value: "hero" },
        { label: "Slider", value: "slider" },
        { label: "Products", value: "products" },
        { label: "Category", value: "category" },
        { label: "Brands", value: "brands" },
      ],
    },
    {
      key: "is_active",
      label: t("section.statusLabel", "Status"),
      type: "select" as const,
      placeholder: t("common.filterByStatus", "Filter by Status"),
      options: [
        { label: t("status.active", "Active"), value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
];