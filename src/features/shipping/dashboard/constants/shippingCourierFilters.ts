import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { ShippingFilters } from "../../model/types/shipping.types";

export const getShippingCourierFilters = (
  t: TFunction
): FilterField<ShippingFilters>[] => [
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
        label: t("status.active", "نشط"),
        value: "1", // أو true حسب ما يستقبله الـ API أو الـ Backend لديك
      },
      {
        label: t("status.inactive", "غير نشط"),
        value: "0",
      },
    ],
  },
  {
    key: "supports_cod",
    label: t("shipping.supportsCod", "الدفع عند الاستلام"),
    type: "select",
    placeholder: t(
      "shipping.selectCodFilter",
      "تصفية حسب الدفع عند الاستلام"
    ),
    options: [
      {
        label: t("filters.all", "الكل"),
        value: "",
      },
      {
        label: t("common.yes", "نعم"),
        value: "1",
      },
      {
        label: t("common.no", "لا"),
        value: "0",
      },
    ],
  },
];