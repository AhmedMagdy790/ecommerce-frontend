import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { PageFilters } from "../model/types/page.types";


export const getPageFilters = (
  t: TFunction,
  lang: string
): FilterField<PageFilters>[] => {
  void lang;

  return [
    {
      key: "is_active",
      label: t("filters.status", "الحالة"),
      type: "select",
      placeholder: t(
        "filters.status_placeholder",
        "تصفية حسب الحالة"
      ),
      options: [
        {
          label: t("filters.all", "الكل"),
          value: "",
        },
        {
          label: t("filters.active", "نشط"),
          value: "true",
        },
        {
          label: t("filters.inactive", "غير نشط"),
          value: "false",
        },
      ],
    },
  ];
};