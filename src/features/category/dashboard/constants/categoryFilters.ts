import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { Category, CategoryFilters } from "../../model/types/category.types";
import { getLocalizedName } from "@/shared/utils/localizeName";


export const getCategoryFilters = (
  t: TFunction,
  parentCategories: Category[] = [],
  lang: string
): FilterField<CategoryFilters>[] => [
  {
    key: "status",
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
        value: "active",
      },
      {
        label: t("filters.inactive", "غير نشط"),
        value: "inactive",
      },
    ],
  },
  {
    key: "parent_id",
    label: t("filters.parent", "القسم الأب"),
    type: "select",
    placeholder: t(
      "filters.parent_placeholder",
      "اختر القسم الأب"
    ),
    options: [
      {
        label: t("filters.all", "الكل"),
        value: "",
      },
      ...parentCategories.map((cat) => ({
        label: getLocalizedName(cat.name, lang),
        value: String(cat.id),
      })),
    ],
  },
];