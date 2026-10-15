// src/features/shipping/constants/shippingRateFilters.ts

import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { ShippingRateFilters } from "../../model/types/rate.types";

export const getShippingRateFilters = (
  t: TFunction,
): FilterField<ShippingRateFilters>[] => [
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
        value: "1",
      },
      {
        label: t("status.inactive", "غير نشط"),
        value: "0",
      },
    ],
  },
  // يمكنك إضافة حقول أخرى هنا مستقبلاً مثل فلترة حسب شركة الشحن (shipping_courier_id) أو المدينة (city_id)
];