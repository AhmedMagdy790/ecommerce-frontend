import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { InventoryFilters } from "../../model/types/inventory.types";



export const getInventoryFilters = (
  t: TFunction,
  _lang: string
): FilterField<InventoryFilters>[] => [
  {
    key: "low_stock",
    label: t("inventory.filters.low_stock", "حالة المخزون"),
    type: "select",
    placeholder: t(
      "inventory.filters.low_stock_placeholder",
      "تصفية حسب المخزون المنخفض"
    ),
    options: [
      {
        label: t("filters.all", "الكل"),
        value: "",
      },
      {
        label: t("inventory.filters.low", "مخزون منخفض"),
        value: "true",
      },
    ],
    // تحويل القيمة القادمة من الـ Select إلى نوع boolean مطابقة للـ State
    parse: (value: string) => value,
  },
];